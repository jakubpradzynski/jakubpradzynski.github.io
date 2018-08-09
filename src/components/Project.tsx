class Project {
    private readonly name: string;
    private readonly htmlUrl: string;
    private readonly description: string;
    private readonly language: string;
    private readonly size: number;
    private readonly createdAt: string;
    private readonly updatedAt: string;

    public constructor(name: string, htmlUrl: string, description: string, language: string, size: number, createdAt: string, updatedAt: string) {
        this.name = name;
        this.htmlUrl = htmlUrl;
        this.description = description;
        this.language = language;
        this.size = size;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getName(): string {
        return this.name;
    }

    public getHtmlUrl(): string {
        return this.htmlUrl;
    }

    public getDescription(): string {
        return this.description;
    }

    public getLanguage(): string {
        return this.language;
    }

    public getSize(): number {
        return this.size;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public getUpdatedAt(): string {
        return this.updatedAt;
    }
}


export default Project;