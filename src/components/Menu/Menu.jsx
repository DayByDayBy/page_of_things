import Drawer from 'react-motion-drawer';
import React, { useState } from 'react';

function Menu() {

    const [isOpen, setIsOpen] = useState(true);

    const handleCloseDrawer = () => {
        setIsOpen(false);

    }

    return (
        <Drawer open={isOpen} onChange={handleCloseDrawer} drawerWidth={250} drawerBackgroundColor="#fff">
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Settings</li>
            </ul>
        </Drawer>)
}


export default Menu;