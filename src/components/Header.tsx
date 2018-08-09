import * as React from 'react';
import '../styles/Header.scss';

class Header extends React.Component {
    public render() {
        const title = "Jakub Prądzyński";
        const subtitle = "Junior Software Developer";
        return (
            <div className="Header">
                <div className="title">
                    <h1>
                        {title}
                    </h1>
                    <h3>
                        {subtitle}
                    </h3>
                </div>
            </div>
        );
    }
    public componentDidMount() {
        document.addEventListener('mousemove', onMove);
    }
    public componentWillUnmount() {
        document.removeEventListener('mousemove', onMove);
    }
}

function onMove(event: MouseEvent) {
    let mouseX;
    let mouseY;
    let traX;
    let traY;
    const e = event;
    mouseX = e.pageX;
    mouseY = e.pageY;
    traX = ((4 * mouseX) / 570) + 40;
    traY = ((4 * mouseY) / 570) + 50;
    const result = traX + "%" + traY + "%";
    document.getElementsByClassName('title').item(0)
        .getElementsByTagName('h1').item(0)
        .setAttribute('style', 'background-position: ' + result);
}

export default Header;