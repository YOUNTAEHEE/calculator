import VersionOne from "../component/versionOne/VersionOne";
import VersionThree from "../component/versionThree/VersionThree";
// import VersionTwo from "../component/versionTwo/VersionTwo";
import styles from "./home.scss";
export default function Home() {
  return (
    <div className="home_containerWrap">
      <VersionOne />
      {/* <VersionTwo /> */}
      {/* <VersionThree /> */}

    </div>
  );
}
