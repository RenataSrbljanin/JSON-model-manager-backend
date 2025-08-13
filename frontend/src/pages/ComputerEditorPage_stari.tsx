import { useState, useEffect as useEffect } from "react";
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
import { normalizeInstalledSoftware } from "../utils/normalizeInstalledSoftware";
import { useNavigate } from 'react-router-dom';
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
      const comp = await getComputerById(computerIdn);
      if (!comp) {
        setError("Računar nije pronađen. Možda je IDN promenjen ili obrisan.");
        setMessage(null); // Čisti poruku o učitavanju
        return null; // Vraćamo null da signaliziramo da nije pronađen
      }

      // Postavlja prethodni IDN u stanje, što je ključno za logiku ažuriranja
      setComputer({ ...comp, previous_idn: comp.idn });

      const installed = await getInstalledSoftwareByComputerId(computerIdn);

      const fetchedSoftwareList = installed || []; // Osiguraj da je uvek niz
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

    // Kloniramo objekat da ne bismo menjali originalno stanje direktno pre slanja
    const { previous_idn: _, ...computerToUpdateDb } = updatedComputer;

    try {
      setMessage("Ažuriranje računara u bazi...");
      console.log("Šaljem PUT za računar:", previous_idn);
      console.log("Podaci za računar:", computerToUpdateDb);

      // 1. Ažuriraj računar u bazi
      await updateComputerById(previous_idn, computerToUpdateDb);

      // 2. Ako se computer_idn promenio, ažuriraj povezani softver u bazi
      if (previous_idn !== new_computer_idn) {
        console.log(`Computer IDN se promenio sa "${previous_idn}" na "${new_computer_idn}". Ažuriram softvere...`);

        const softwareUpdatePromises = softwareList.map(async (software) => {
          // Pozivamo funkciju za ažuriranje softvera sa novim computer_idn-om
          return handleSoftwareUpdate(
            software.idn, // Originalni IDN softvera za PUT rutu
            new_computer_idn, // Novi computer_idn koji treba da se zapiše u softver
            software // Prosleđujemo ceo objekat softvera radi drugih polja
          );
        });
        await Promise.all(softwareUpdatePromises);
        console.log("Svi softveri uspešno ažurirani.");

        // BITNO: Ovo se dešava nakon što je baza ažurirana
        if (new_computer_idn !== idn) { // Provera da li je idn u URL-u zaista različit
          navigate(`/computers/${new_computer_idn}`);
        }
      }

      // Nakon svih ažuriranja u bazi (i potencijalne navigacije),
      // ponovo dohvati sve podatke da bi se osvežio frontend state
      const latestData = await fetchData(new_computer_idn);
      if (latestData) {
        setMessage("Računar i instalirani softveri uspešno ažurirani u bazi!");
        return { success: true, computer: latestData.computer, softwareList: latestData.softwareList };
      } else {
        throw new Error("Nije moguće dohvatiti najnovije podatke nakon ažuriranja.");
      }
    }
    catch (error) {
      console.error("Greška prilikom ažuriranja računara ili softvera:", error);
      setMessage("Došlo je do greške prilikom ažuriranja računara.");
      setError("Došlo je do greške prilikom ažuriranja. Detalji u konzoli.");
      return { success: false, error };
    }
  };

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

  const handleSaveToFile = async (modifiedData: any) => {
    try {
      setMessage("Čuvanje podataka u fajl...");
      const response = await axios.post("http://localhost:5000/save", modifiedData);
      setMessage(`Uspešno sačuvano u fajl: ${response.data.filename}`);
    } catch (error) {
      console.error("Greška pri snimanju u fajl!:", error);
      setMessage("Greška pri čuvanju fajla.");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!computer) return <div>Učitavanje...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Uređivanje računara: {idn}</h2>
      {message && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-blue-700 hover:text-blue-900 font-bold ml-4">X</button>
        </div>
      )}

      <div className="bg-white shadow-md rounded p-4 mb-6">
        <ComputerForm
          computer={computer}
          softwareList={softwareList}
          onChange={setComputer}
          onSoftwareUpdate={handleSoftwareUpdate}
        />
      </div>

      <button
        onClick={async () => {
          try {
            // 1. Prvo ažuriramo računar i softver u bazi.
            // Ova funkcija će takođe pozvati fetchData i obaviti navigaciju ako je potrebno.
            const updateResult = await handleComputerUpdate(computer);

            if (updateResult.success) {
              // 2. Ako je ažuriranje u bazi uspešno, koristimo najnovije podatke
              // koje je fetchData već učitala i postavila u stanje.
              // BITNO: Koristimo updateResult.computer i updateResult.softwareList
              // jer su oni zagarantovano najnoviji podaci nakon fetchData poziva.
              const latestComputerForFile = updateResult.computer;
              const latestSoftwareListForFile = updateResult.softwareList;

              // Provera da li latestComputerForFile ima previous_idn pre destrukturiranja
              // Iako bi trebalo da ga ima nakon fetchData, dodajemo za sigurnost:
              const { previous_idn: _, ...computerToSaveToFile } = latestComputerForFile;

              await handleSaveToFile({
                [computerToSaveToFile.idn]: {
                  ...computerToSaveToFile,
                  installed_software: Object.fromEntries(latestSoftwareListForFile.map((s) => [s.idn, s])),
                },
              });
              setMessage("Kompjuter uspešno sačuvan u bazi i kao fajl!");
            } else {
              setMessage("Ažuriranje u bazi nije uspešno, fajl nije sačuvan.");
            }
          } catch (error) {
            console.error("Greška prilikom čuvanja u fajl: ", error);
            setMessage("Došlo je do greške prilikom čuvanja u fajl.");
          }
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded mt-4" >
        Sačuvaj u bazi i kao fajl
      </button>
    </div>
  );
}
