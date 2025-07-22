import React,{ useEffect, useState, useMemo} from "react";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select"; // Import Select component and types
import type { SingleValue, MenuListProps } from "react-select"; // Import SingleValue type-only
import FileUpload from "../components/FileUpload";
import { getAllComputers } from "../api/computers";
import type { Computer } from "../types/computer";
import { FixedSizeList } from "react-window";

// Define the shape of options for react-select
// Assuming your Computer type already has an 'idn' property which will be both value and label
interface SelectOption {
  value: string;
  label: string;
}
// Custom MenuList komponenta za react-select sa virtualizacijom
// Koristi FixedSizeList iz 'react-window' za renderovanje samo vidljivih opcija
const CustomMenuList = (props: MenuListProps<SelectOption>) => {
  const { options, children, maxHeight, getValue } = props;
  // children je array elemenata koje react-select želi da renderuje (filtrirane opcije)
  // Moramo ga pretvoriti u niz React elemenata za FixedSizeList
  const childrenArray = React.Children.toArray(children);

  const [value] = getValue(); // Dohvati trenutno odabranu vrednost
  const itemHeight = 35; // Pretpostavljena visina svake opcije u pikselima, prilagodite po potrebi

  // Izračunaj početni offset skrolovanja ako je neka opcija već odabrana
  // Pronađi indeks odabrane opcije unutar filtriranog niza 'childrenArray'
  const selectedIndex = childrenArray.findIndex(
    (child: any) => child && child.props && child.props.data && child.props.data.value === value?.value
  );
  const initialOffset = selectedIndex !== -1 ? selectedIndex * itemHeight : 0;

  return (
    <components.MenuList {...props}>
      <FixedSizeList
        height={maxHeight} // Visina liste, preuzeta iz propsa react-selecta
        width="100%" // Dodaj width prop, može biti broj (npr. 300) ili string (npr. "100%")
        itemCount={childrenArray.length} // Ukupan broj opcija (vidljivih i nevidljivih)
        itemSize={itemHeight} // Visina pojedinačne opcije
        initialScrollOffset={initialOffset} // Početna pozicija skrolovanja
      >
        {({ index, style }) => (
          // Renderuj samo opciju na datom indeksu sa njenim stilom
          // Ključno je da se prop 'style' prosledi elementu, jer 'react-window' upravlja pozicioniranjem
          <div style={style}>
            {childrenArray[index]}
          </div>
        )}
      </FixedSizeList>
    </components.MenuList>
  );
};
export default function HomePage() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [selectedIdn, setSelectedIdn] = useState<string | null>(null); // Allow null for no selection
  const navigate = useNavigate();

  // Function to fetch all computers from the API
  const fetchComputers = async () => {
    try {
      const comps = await getAllComputers();
      setComputers(comps);
    } catch (err) {
      console.error("Greška pri učitavanju računara:", err);
      // Optionally, show a user-friendly error message
    }
  };

  // Fetch computers on component mount
  useEffect(() => {
    fetchComputers();
  }, []);

  // Koristi useMemo kako bi se options izračunale samo kada se promijeni lista računara
  const computerOptions: SelectOption[] = useMemo(() => {
    return computers.map((comp) => ({
      value: comp.idn,
      label: comp.idn,
    }));
  }, [computers]); // Ovisnost: ponovo izračunaj samo kada se 'computers' promijeni

  // Odredi trenutno odabranu opciju za 'value' prop react-selecta
  // Koristi useMemo kako bi se ova opcija izračunala samo kada se promijene 'computerOptions' ili 'selectedIdn'
  const currentSelectedOption: SingleValue<SelectOption> = useMemo(() => {
    return computerOptions.find((option) => option.value === selectedIdn) || null;
  }, [computerOptions, selectedIdn]); // Ovisnosti: ponovo izračunaj kada se 'computerOptions' ili 'selectedIdn' promijeni

  // Handler for when a computer is selected in the react-select dropdown
  const handleSelectChange = (newValue: SingleValue<SelectOption>) => {
    // newValue will be an object { value: string, label: string } or null
    setSelectedIdn(newValue ? newValue.value : null);
  };

  // Handler for the "Izmeni" button click
  const handleEditClick = () => {
    if (selectedIdn) {
      navigate(`/computers/${selectedIdn}`);
    }
  };

  // // Prepare options for react-select from the fetched computers
  // const computerOptions: SelectOption[] = computers.map((comp) => ({
  //   value: comp.idn,
  //   label: comp.idn,
  // }));

  // // Determine the currently selected option object for react-select's 'value' prop
  // const currentSelectedOption: SingleValue<SelectOption> = computerOptions.find((option) => option.value === selectedIdn) || null;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Upravljanje JSON Modelima</h1>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Učitaj JSON fajl</h2>
        <FileUpload onUploadSuccess={fetchComputers} />
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Izaberi računar za izmenu</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* React-Select component */}
          <div className="flex-grow w-full sm:w-auto">
            <Select<SelectOption>
              id="computer-select" // Good for accessibility
              options={computerOptions}
              value={currentSelectedOption}
              onChange={handleSelectChange}
              placeholder="-- Odaberi računar --"
              isSearchable={true} // Enables the search/filter functionality
              isClearable={true} // Allows the user to clear the selection
              className="react-select-container" // Custom class for external styling if needed
              classNamePrefix="react-select" // For internal element styling
              components={{ MenuList: CustomMenuList }}
              // Tailwind classes for basic appearance (react-select has its own internal styling)
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderColor: "#d1d5db", // gray-300
                  borderRadius: "0.375rem", // rounded-md
                  padding: "0.25rem 0.5rem", // px-2 py-1
                  minHeight: "42px", // Adjust height as needed
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: "#6b7280", // gray-500
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: "#1f2937", // gray-900
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? "#e0e7ff" : "white", // blue-100 on focus
                  color: state.isSelected ? "#1d4ed8" : "#1f2937", // blue-700 if selected
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem", // rounded-md
                  margin: "0.25rem",
                  width: "calc(100% - 0.5rem)",
                  "&:active": {
                    backgroundColor: "#bfdbfe", // blue-200 on active
                  },
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: "0.375rem", // rounded-md
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // shadow-lg
                  marginTop: "0.5rem",
                }),
                menuList: (baseStyles) => ({
                  ...baseStyles,
                  padding: "0.25rem",
                }),
              }}
            />
          </div>
          <button
            onClick={handleEditClick}
            disabled={!selectedIdn}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Izmeni
          </button>
        </div>
      </section>
    </div>
  );
}
