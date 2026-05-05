import { RoutedNavLink } from "@diligentcorp/atlas-react-bundle/global-nav";
import HomeIcon from "@diligentcorp/atlas-react-bundle/icons/Home";
import AuditIcon from "@diligentcorp/atlas-react-bundle/icons/Audit";
import GroupIcon from "@diligentcorp/atlas-react-bundle/icons/Group";
import SettingsIcon from "@diligentcorp/atlas-react-bundle/icons/Settings";

export default function Navigation() {
  return (
    <>
      <RoutedNavLink to="/" label="Home">
        <HomeIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/audits" label="Audits">
        <AuditIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/people" label="People & Groups">
        <GroupIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/settings" label="Settings">
        <SettingsIcon slot="icon" />
      </RoutedNavLink>
    </>
  );
}
