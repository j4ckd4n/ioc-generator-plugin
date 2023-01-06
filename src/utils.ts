import { MarkdownView, WorkspaceLeaf } from "obsidian";

var iocIgnoreArray = new Array<string>();

export function addToIgnoreArray(item: string){
    iocIgnoreArray.push(item);
}

export function isIocInIgnoreArray(ioc: string){
    return iocIgnoreArray.contains(ioc);
}

export class MarkdownAdder {
    string_buffer: Array<String>;
    
    constructor(){
        this.string_buffer = new Array();
    }
    
    addHeader1(text: string){
        this.string_buffer.push(`# ${text}\n`);
    }

    addHeader2(text: string){
        this.string_buffer.push(`## ${text}\n`);
    }

    addContent(text: string){
        this.string_buffer.push(`${text}\n`);
    }

    addListItem(text: string){
        this.string_buffer.push(`- ${text}\n`);
    }

    addInfoItem(item_name: string, text: string){
        this.string_buffer.push(`${item_name}:: ${text}\n`);
    }

    addSplit(){
        this.string_buffer.push('\n---\n')
    }

    toString(){
        return this.string_buffer.filter(s => s).join('');
    }
}