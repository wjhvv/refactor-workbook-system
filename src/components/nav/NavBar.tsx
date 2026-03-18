import { Link, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import { navStyles } from "./nav.styles";

interface NavBarProps {
  title: string;
  logoUrl?: string;
}

export function NavBar({ title, logoUrl }: NavBarProps) {
  const { pathname } = useLocation();

  return (
    <nav className={navStyles.base}>
      <div className={navStyles.brand}>
        {logoUrl && (
          <img src={logoUrl} alt="logo" className={navStyles.logoImage} />
        )}
        <span className={navStyles.title}>{title}</span>
      </div>
      <div className={navStyles.items}>
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className={isActive ? navStyles.itemActive : navStyles.item}
            >
              {Icon && <Icon size={14} />}
              {route.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
