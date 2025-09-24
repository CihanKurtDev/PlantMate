import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import styles from './Layout.module.scss'
import { Button } from "../Button/Button";

export const Layout: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const userIsNotInOverView = location.pathname !== "/"

    return (
        <>
            <header className={styles.header}>
                <div>PlantMate</div>
                <div className="header-actions">
                    {userIsNotInOverView && <Button variant="transparent" onClick={() =>  navigate('/')}>←</Button>}
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
};
