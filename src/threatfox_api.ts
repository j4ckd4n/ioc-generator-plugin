export class ThreatFox {
    public id: string;
    public ioc: string;
    public threatType: string;
    public threatTypeDesc: string;
    public iocType: string;
    public iocTypeDesc: string;
    public malware: string;
    public malwarePrintable: string;
    public malwareAlias: string;
    public malwareMalpedia: string;
    public confidenceLevel: string;
    public firstSeen: string;
    public lastSeen: string;
    public reporter: string;
    public reference: string;
    public tags: Array<string>;

    public toString(): string{
        return `IoC: \`${this.ioc}\`\n` + 
            `IoC ID: [${this.id}](https://threatfox.abuse.ch/ioc/${this.id}/)\n` +
            `IoC Type: ${this.iocType}\`\n` +
            `IoC Type Desc: \`${this.iocTypeDesc}\`\n` +
            `Threat Type: \`${this.threatType}\`\n` +
            `Malware: \`${this.malware}\`\n` + 
            `Malware Alias: \`${this.malwareAlias}\`\n` +
            `Malware Printable: \`${this.malwarePrintable}\`\n` +
            `Confidence Level: \`${this.confidenceLevel}\`\n` +
            `First Seen: \`${this.firstSeen}\`\n` +
            `Last Seen: \`${this.lastSeen}\`\n` +
            `Reporter: \`${this.reporter}\`\n` +
            `Reference: \`${this.reference}\`\n` +
            `Tags: ${(this.tags !== null) ? this.tags.toString() : "undefined"}`;
    }
}

export async function getLastestIoCs(): Promise<ThreatFox[]> {
    const threatFoxApiUrl = "http://localhost:8080/";
    return fetch(threatFoxApiUrl)
    .then((res) => res.json())
    .then((queryRes) => {
        const ids = Object.keys(queryRes);
        var array = new Array<ThreatFox>();
        ids.forEach((id: any) => {

            const threat = queryRes[id][0];
            let temp = new ThreatFox();

            temp.id = id;
            if(threat.ioc_value.contains("http"))
                temp.ioc = threat.ioc_value.replace("http", "hxxp");
            else
                temp.ioc = threat.ioc_value;
            temp.threatType = threat.threat_type;
            temp.iocType = threat.ioc_type;
            temp.iocTypeDesc = threat.ioc_type_desc;
            temp.malware = threat.malware;
            temp.malwarePrintable = threat.malware_printable;
            temp.malwareAlias = threat.malware_alias;
            temp.confidenceLevel = threat.confidence_level;
            temp.firstSeen = threat.first_seen_utc;
            temp.lastSeen = threat.last_seen_utc;
            temp.reporter = threat.reporter;
            temp.reference = threat.reference;
            temp.tags = threat.tags;

            array.push(temp);
        });
        return array;
    }) 
}
