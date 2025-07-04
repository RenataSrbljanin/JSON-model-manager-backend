import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Computer System Manager</h1>
      <ul className="space-y-2">
        <li>
          <Link to="/computers/comp-1" className="text-blue-600 underline">
            Edit Computer comp-1
          </Link>
        </li>
        <li>
          <Link
            to="/installed-software/soft-1"
            className="text-blue-600 underline"
          >
            Edit Installed Software soft-1
          </Link>
        </li>
      </ul>
    </div>
  );
}
