import { Link } from "react-router-dom";
import { Button } from "../../UI/Button/Button";
import { useAuth } from "../../../hooks/useAuth"; // путь может отличаться, если хук лежит в contexts
import { useCart } from "../../../hooks/useCart";
import styles from "./Header.module.scss";

export const Header = () => {
  const { username, isLogged, logout } = useAuth();
  const { totalCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img
            src="public\images\logo.png"
            alt="Логотип"
            className={styles.logoImage}
          />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Главная
        </Link>
        <Link to="/menu" className={styles.navLink}>
          Меню
        </Link>
        <Link to="/cart" className={styles.cartLink}>
          <span className={styles.cartIcon}>🛒</span>
          {totalCount > 0 && (
            <span className={styles.cartBadge}>{totalCount}</span>
          )}
        </Link>
      </nav>
      <div className={styles.header__right}>
        <div className={styles.location}>
          <img
            src="public\images\location.png"
            alt=""
            className={styles.locationIcon}
          />
          <span>Екатеринбург</span>
        </div>
        <span className={styles.phone}>+7(999)-999-99-99</span>
        {isLogged ? (
          <div className={styles.userMenu}>
            <Link to="/profile" className={styles.userName}>
              {username}
            </Link>
            <Button color="white" onClick={logout}>
              Выйти
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button>Войти</Button>
          </Link>
        )}
      </div>
    </header>
  );
};
