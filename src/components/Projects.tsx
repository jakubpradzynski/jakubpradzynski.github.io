import * as React from 'react';
import '../styles/Projects.scss';

import Project from './Project';

class Projects extends React.Component<{ clear: any, projects: [Project] }, {}> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        const projectsList = this.props.projects.map((project) =>
            this.renderElement(project)
        );
        return (
            <div className='projects'>
                <div className='close'>
                    <a onClick={this.props.clear} href="#" className="close-button"/>
                </div>
                <div className='title'>
                    <h2>My projects on <a href="https://github.com/jakubpradzynski">GitHub</a></h2>
                </div>
                <div className='main'>
                    <table className="projectsList">
                        {this.renderTableHeaders()}
                        {projectsList}
                    </table>
                </div>
            </div>
        );
    }

    private renderTableHeaders(): JSX.Element {
        return (
            <tr className='headers'>
                <td>Name</td>
                <td>Description</td>
                <td>Language</td>
                <td>Size</td>
                <td>Created at</td>
                <td>Updated at</td>
                <td>Link</td>
            </tr>
        );
    }

    private renderElement(project: Project): JSX.Element {
        return (
            <tr className='row'>
                <td>{project.getName()}</td>
                <td>{project.getDescription()}</td>
                <td>{project.getLanguage()}</td>
                <td>{project.getSize()}</td>
                <td>{new Date(project.getCreatedAt()).toUTCString()}</td>
                <td>{new Date(project.getUpdatedAt()).toUTCString()}</td>
                <td><a href={project.getHtmlUrl()}>{project.getHtmlUrl()}</a></td>
            </tr>
        );
    }
}

export default Projects;