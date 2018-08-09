import * as React from 'react';
import '../styles/Content.scss';

import axios from "axios";
import AboutMe from './AboutMe';
import Contact from "./Contact";
import Project from './Project';
import Projects from './Projects';

class Content extends React.Component<{ option: string, clear: any }, { projects: [any] }> {
    constructor(props: any) {
        super(props);

        this.state = {
            projects : [new Project("null", "null", "null", "null", 0, "null", "null")]
        }
    }

    public componentDidMount() {
        axios
            .get("https://api.github.com/users/jakubpradzynski/repos?sort=update?page=1")
            .then(response => {
                const newProjects = response.data.map((c: any) => {
                    return new Project(c.name, c.html_url, c.description, c.language, c.size, c.created_at, c.updated_at);
                });
                const newState = Object.assign({}, this.state, {
                    projects: newProjects
                });
                this.setState(newState);
            })
            .catch(error => console.log(error));
    }


    public render() {
        switch (this.props.option) {
            case 'about-me': {
                return (<AboutMe clear={this.props.clear}/>);
            }
            case 'projects': {
                return (<Projects clear={this.props.clear} projects={this.state.projects}/>);
            }
            case 'contact': {
                return (<Contact clear={this.props.clear}/>);
            }
            default: {
                return (null);
            }
        }
    }

}

export default Content;
