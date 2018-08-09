import * as React from 'react';
import '../styles/Menu.scss';

function Menu({aboutMe, projects, contact, mycv}: { aboutMe: any, projects: any, contact: any, mycv: any }) {
    return (
        <div className="Menu">
            <button onClick={aboutMe}>About me</button>
            <button onClick={projects}>Projects</button>
            <button onClick={contact}>Contact</button>
            <button onClick={mycv}>My CV</button>
        </div>
    );
}

export default Menu;