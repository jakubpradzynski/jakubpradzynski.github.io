import * as React from 'react';
import '../styles/Main.scss';

import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Loader from './Loader';
import Menu from './Menu';

class Main extends React.Component<{}, { selectedMenuButton: any, loaderTime: boolean }> {
    constructor(props: any) {
        super(props);

        this.state = {
            loaderTime: true,
            selectedMenuButton: "",
        };
    }

    public showAboutMe = () => {
        this.setState({
            selectedMenuButton: "about-me",
        });
    };

    public showProjects = () => {
        this.setState({
            selectedMenuButton: "projects",
        });
    };

    public showContact = () => {
        this.setState({
            selectedMenuButton: "contact",
        });
    };

    public showMyCV = () => {
        document.location.href = 'https://drive.google.com/open?id=1CM9EKLw8YAyZm3qbq2dTWWsqm1mnsscD';
    };

    public clearOption = () => {
        this.setState({
            selectedMenuButton: "",
        })
    };

    public componentDidMount() {
        setTimeout(() => {
            this.setState({loaderTime: false})
        }, 2000)
    }

    public render() {
        if (this.state.loaderTime) {
            return (
                <div className="Loader">
                <Loader/>
                </div>
            );
        }
        return (
            <div className="Main">
                <Content option={this.state.selectedMenuButton} clear={this.clearOption}/>
                {this.state.selectedMenuButton === '' ? <Header/> : null}
                {this.state.selectedMenuButton === '' ?
                    <Menu aboutMe={this.showAboutMe} projects={this.showProjects} contact={this.showContact} mycv={this.showMyCV}/> : null}
                {this.state.selectedMenuButton === '' ? <Footer/> : null}
                }
            </div>
        );
    }
}

export default Main;
