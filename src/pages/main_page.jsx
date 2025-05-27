import Home from "../components/home.jsx";
import Empty from "../components/empty.jsx";
import ObjectViewer from "../components/3d-viewer";

function MainPage() {
  return (
    <>
      <div className="relative overflow-x-clip">
        <ObjectViewer />
      </div>
    </>
  );
}

export default MainPage;
