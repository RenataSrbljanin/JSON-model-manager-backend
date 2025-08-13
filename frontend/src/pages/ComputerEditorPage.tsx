import { useState, useEffect } from "react";
import ComputerForm from "../components/ComputerForm_1";
import { getComputerById, updateComputerbyID as updateComputerById } from "../api/computers";
import {
  getInstalledSoftwareByComputerId,
  updateSingleSoftwareWithNewComputerIdn
} from "../api/installedSoftware";
import type { Computer as BaseComputer } from "../types/computer";
type Computer = BaseComputer & { previous_idn?: string };
import type { Software } from "../types/software";
import axios from "axios";

import { useNavigate } from 'react-router-dom'; // Uvozimo useNavigate hook

export default function ComputerEditorPage({ idn }: { idn: string }) {
  const [computer, setComputer] = useState<Computer | null>(null);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Pomoćna funkcija za učitavanje podataka o računaru i softveru.
  const fetchData = async (computerIdn: string)
    : Promise<{ computer: Computer, softwareList: Software[] } | null> => {

    try {
      setMessage("Učitavanje podataka...");
      const comp = await getComputerById(computerIdn);
      
      if (!comp) {
        setError("Računar nije pronađen. Možda je IDN promenjen ili obrisan.");
        setMessage(null); // Čisti poruku o učitavanju
        return null; // Vraćamo null da signaliziramo da nije pronađen
      }
      
      // Postavlja prethodni IDN u stanje, što je ključno za logiku ažuriranja
      setComputer({ ...comp, previous_idn: comp.idn });

      const installed = await getInstalledSoftwareByComputerId(computerIdn);
      const fetchedSoftwareList: Software[] = installed || []; // Osiguraj da je uvek niz
      setSoftwareList(fetchedSoftwareList);

      setError(null); // Čisti greške nakon uspešnog učitavanja
      setMessage("Podaci uspešno učitani."); // Potvrda uspešnog učitavanja

      // Vraćamo dohvaćene podatke sa previous_idn:  
      return {
        computer: { ...comp, previous_idn: comp.idn },
        softwareList: fetchedSoftwareList
      };
    } catch (err) {
      console.error("Greška prilikom učitavanja:", err);
      setError("Greška prilikom učitavanja podataka.");
      setMessage(null); // Čisti poruku o učitavanju
      return null;
    }
  };

  useEffect(() => {
    // `useEffect` automatski poziva `fetchData` kada se `idn` promeni
    fetchData(idn);
  }, [idn]);

  // Poboljšana povratna vrednost za handleComputerUpdate:
  type UpdateResult = { success: true; computer: Computer; softwareList: Software[]; }
                    | { success: false; error: any; };

  const handleComputerUpdate = async (updatedComputer: Computer): Promise<UpdateResult> => {
    const previous_idn = updatedComputer.previous_idn || updatedComputer.idn;
    const new_computer_idn = updatedComputer.idn;

    // Kreiramo kopiju objekta za slanje, uklanjajući 'previous_idn'
    const { previous_idn: _, ...computerToUpdateDb } = updatedComputer;

    try {
      setMessage("Ažuriranje računara u bazi...");
      console.log("Šaljem PUT za računar:", previous_idn);
      console.log("Podaci za računar:", computerToUpdateDb);

      let finalSoftwareIdnsForComputer: string[] = [];
      let newSoftwareDataLinks: { [key: string]: string[] } = {}; // Za ažurirane softverske linkove

      // Provera da li se IDN računara promenio
      if (previous_idn !== new_computer_idn) {
        console.log(`Computer IDN se promenio sa "${previous_idn}" na "${new_computer_idn}". Ažuriram softvere...`);

        // 1. Ažuriraj pojedinačne softvere u bazi
        const softwareUpdatePromises = softwareList.map(async (software) => {
          return updateSingleSoftwareWithNewComputerIdn(
            software.idn, // Originalni IDN softvera za PUT rutu
            new_computer_idn, // Novi computer_idn koji treba da se zapiše u softver
            software // Prosleđujemo ceo objekat softvera radi drugih polja
          );
        });
        await Promise.all(softwareUpdatePromises);
        console.log("Svi softveri uspešno ažurirani u bazi.");

        // 2. Kreiraj novu listu IDN-ova softvera za AŽURIRANI računar
        // Ovo se radi tako što se uzme CPE IDN i UUID iz starog IDN-a softvera
        // i kombinuje sa NOVIM IDN-om računara.
        finalSoftwareIdnsForComputer = softwareList.map(software => {
          const parts = software.idn.split('>');
          const cpeIdnAndUuid = parts[1]; // npr. cpe:/a:microsoft:office:2019#uuid
          // Novi IDN softvera: [novi_computer_idn]>[cpe_idn_i_uuid]
          return `${new_computer_idn}>${cpeIdnAndUuid}`;
        });

        // --- AŽURIRANJE software_data_links ---
        if (computerToUpdateDb.software_data_links) {
          for (const oldSoftwareIdn in computerToUpdateDb.software_data_links) {
            if (Object.prototype.hasOwnProperty.call(computerToUpdateDb.software_data_links, oldSoftwareIdn)) {
              const dataLinks = computerToUpdateDb.software_data_links[oldSoftwareIdn];
              // Izdvoji samo deo IDN-a softvera nakon prvog '>' (npr. cpe:/a:microsoft:.net_framework:4.8#uuid)
              const parts = oldSoftwareIdn.split('>');
              const cpeIdnAndUuid = parts.length > 1 ? parts[1] : ''; // Očekujemo da uvek postoji drugi deo

              if (cpeIdnAndUuid) {
                  const newSoftwareIdnKey = `${new_computer_idn}>${cpeIdnAndUuid}`;
                  newSoftwareDataLinks[newSoftwareIdnKey] = dataLinks;
              } else {
                  // Ako format IDN-a nije očekivan, zadrži originalni key ili ga ignoriši
                  console.warn(`Neočekivani format software IDN ključa u software_data_links: ${oldSoftwareIdn}. Neće biti ažuriran.`);
                  newSoftwareDataLinks[oldSoftwareIdn] = dataLinks;
              }
            }
          }
        }
      } else {
        // Ako se IDN računara NIJE promenio, lista IDN-ova softvera ostaje ista
        finalSoftwareIdnsForComputer = softwareList.map(s => s.idn);
        // Ako se computer IDN nije promenio, zadržavamo postojeće software_data_links
        newSoftwareDataLinks = computerToUpdateDb.software_data_links || {};
 }

      // 4. Ažuriraj 'installed_software_idns' atribut u objektu računara koji se šalje u bazu
      computerToUpdateDb.installed_software_idns = finalSoftwareIdnsForComputer;
      computerToUpdateDb.software_data_links = newSoftwareDataLinks; // Ažurira objekat pre slanja

      // 5. Ažuriraj računar u bazi sa KONAČNIM podacima (uključujući ažurirane installed_software_idns)
      await updateComputerById(previous_idn, computerToUpdateDb);

      await new Promise(resolve => setTimeout(resolve, 3000));// uvodim malo cekanje za bazu

      // Nakon svih ažuriranja u bazi (i potencijalne navigacije),
      // ponovo dohvati sve podatke da bi se osvežio frontend state i dobili zagarantovano najnoviji podaci.
      // --- KLJUČNA IZMENA: DODATO RETRY LOGIKU ---
      let retries = 10; // Pokušavamo do 10 puta
      let delay = 100; // Počinjemo sa 100ms kašnjenja
      let latestData: { computer: Computer, softwareList: Software[] } | null = null;

      while (retries > 0) {
          // Važno: fetchData interno postavlja `setMessage` i `setComputer`/`setSoftwareList`.
          // Ovdje koristimo povratnu vrednost da proverimo da li je uspeh.
          latestData = await fetchData(new_computer_idn);
          if (latestData) {
              break; // Podaci su pronađeni, izlazimo iz petlje
          }
          console.warn(`Pokušaj dohvaćanja računara ${new_computer_idn} neuspešan. Preostali pokušaji: ${retries - 1}. Čekam ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay)); // Čekaj
          retries--;
          delay = Math.min(delay * 1.5, 2000); // Povećaj kašnjenje eksponencijalno, do max 2 sekunde
      }
      if (latestData) {
        setMessage("Računar i instalirani softveri uspešno ažurirani u bazi!");
        // Navigacija se dešava tek kada smo sigurni da su novi podaci dostupni.
        if (new_computer_idn !== idn) {
          navigate(`/computers/${new_computer_idn}`);
        }
        return { success: true, computer: latestData.computer, softwareList: latestData.softwareList };
      } else {
        throw new Error("Nije moguće dohvatiti najnovije podatke nakon ažuriranja. Računar možda ne postoji.");
      }
    } catch (error) {
      console.error("Greška prilikom ažuriranja računara ili softvera:", error);
      setMessage("Došlo je do greške prilikom ažuriranja računara.");
      setError("Došlo je do greške prilikom ažuriranja. Detalji u konzoli.");
      return { success: false, error };
    }
  };

  // Ova funkcija se poziva kada se ažurira pojedinačni softver unutar ComputerForm_1
  const handleSoftwareUpdate = async (
    currentSoftwareIdn: string,
    newComputerIdn: string,
    softwareData: Partial<Software>
  ) => {
    try {
      setMessage("Ažuriranje softvera u bazi...");
      const result = await updateSingleSoftwareWithNewComputerIdn(
        currentSoftwareIdn,
        newComputerIdn,
        softwareData
      );
      // Nakon uspešnog ažuriranja pojedinačnog softvera,
      // ponovo dohvati celokupnu listu softvera za trenutni računar
      await fetchData(newComputerIdn);
      setMessage(`Softver ${currentSoftwareIdn} uspešno ažuriran.`);
      return result;
    } catch (error) {
      console.error(`Greška pri ažuriranju softvera ${currentSoftwareIdn}:`, error);
      setMessage(`Greška pri ažuriranju softvera ${currentSoftwareIdn}.`);
      throw error;
    }
  };

  const handleSaveToFile = async (dataToSave: any) => {
    try {
      setMessage("Čuvanje podataka u fajl...");
      const response = await axios.post("http://localhost:5000/save", dataToSave);
      setMessage(`Uspešno sačuvano u fajl: ${response.data.filename}`);
    } catch (error) {
      console.error("Greška pri snimanju u fajl!:", error);
      setMessage("Greška pri čuvanju fajla.");
      setError("Greška pri čuvanju fajla. Detalji u konzoli.");
    }
  };

  if (error) return <div className="p-4 text-red-500 font-bold">{error}</div>;
  // Dodata provera da li je 'computer' null pre renderovanja forme
  if (!computer) return <div className="p-4 text-gray-500">Učitavanje podataka o računaru...</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Uređivanje računara: {computer.idn}</h2>
      
      {message && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 flex items-center justify-between shadow">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-blue-700 hover:text-blue-900 font-bold ml-4">X</button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <ComputerForm
          computer={computer}
          softwareList={softwareList}
          onChange={setComputer}
          onSoftwareUpdate={handleSoftwareUpdate}
        />
      </div>

      <button
        onClick={async () => {
          // Dodata provera da li je 'computer' null pre poziva handleComputerUpdate
          if (!computer) {
              setMessage("Greška: Podaci o računaru nisu učitani.");
              return;
          }

          try {
            // 1. Prvo ažuriramo računar i softver u bazi.
            // Ova funkcija će takođe pozvati fetchData i obaviti navigaciju ako je potrebno.
            const updateResult = await handleComputerUpdate(computer);

            if (updateResult.success) {
              // 2. Ako je ažuriranje u bazi uspešno, koristimo najnovije podatke
              // koje je fetchData već učitala i postavila u stanje.
              const latestComputerForFile = updateResult.computer;
              const latestSoftwareListForFile = updateResult.softwareList;

              // Destrukturiranje sa proverom da 'previous_idn' postoji, iako tipizacija to sada garantuje
              const { previous_idn: _, ...computerToSaveToFile } = latestComputerForFile;

              await handleSaveToFile({
                [computerToSaveToFile.idn]: {
                  ...computerToSaveToFile,
                  // Ovde se koriste IDN-ovi iz liste softvera koja je upravo osvežena
                  installed_software: Object.fromEntries(latestSoftwareListForFile.map((s) => [s.idn, s])),
                },
              });
              setMessage("Kompjuter uspešno sačuvan u bazi i kao fajl!");
            } else {
                setMessage("Ažuriranje u bazi nije uspešno, fajl nije sačuvan.");
            }
          } catch (catchError) {
            console.error("Greška prilikom čuvanja u fajl:", catchError);
            setMessage("Došlo je do greške prilikom čuvanja u fajl.");
            setError("Greška prilikom čuvanja u fajl. Detalji u konzoli.");
          }
        }}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition-colors duration-200"
      >
        Sačuvaj u bazi i kao fajl
      </button>
    </div>
  );
}
