import { ItemView, MarkdownView, WorkspaceLeaf } from 'obsidian';
import { getLastestIoCs, ThreatFox } from './threatfox_api';
import { isIocInIgnoreArray, addToIgnoreArray } from './utils';

export const CARD_MENU_LEAF = "card_menu_leaf";

export class CardMenu extends ItemView {
    constructor(leaf: WorkspaceLeaf){
        super(leaf);
    }

    getViewType(): string {
        return CARD_MENU_LEAF;
    }

    getDisplayText(): string {
        return "ThreatFox Latest IoCs";
    }

    async onOpen() {
        const array = await getLastestIoCs();

        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("h4", { text: "ThreatFox Latest IoCs", cls: "title_h4"});
        
        const card_container = container.createEl("div", { cls: "card_container" });

        array.forEach((item, index) => {
            if(index == 5){
                return
            }

            if(!isIocInIgnoreArray(item.id)){
                const card_div = card_container.createDiv({ cls: "card_div"});
                const header_div = card_div.createDiv({ cls: "header_div"});
                const data_div = card_div.createDiv({ cls: "data_div" })

                const del = card_container.createDiv({cls: 'delete_zoom'});

                const ignore_btn = card_div.createEl('input', { type: "button", value: "HIDE", cls: "ignore_btn"});

                ignore_btn.onClickEvent(() => {
                    addToIgnoreArray(item.id)
                    card_div.addClass("removed-item");
                    setTimeout(() => {
                        card_container.removeChild(card_div);
                    }, 500)
                });

                header_div.createEl('h1', { text: `ioc: ${item.ioc}`} );
                
                data_div.createEl('p', { text: `id: ${item.id}`})
                data_div.createEl('p', { text: `Source: ThreatFox` });
                data_div.createEl('p', { text: `ioc_malware: ${item.malware}`})
                data_div.createEl('p', { text: `first_seen: ${item.firstSeen}`})

                data_div.onClickEvent(() => {
                    const leaf = this.app.workspace.getMostRecentLeaf()

                    let editor = null;

                    if (leaf != null && leaf.view instanceof MarkdownView) {
                        editor = leaf.view.editor;

                        if(!editor)
                            return;

                        const line = editor.getCursor().line;

                        editor.focus();

                        editor.setLine(line, item.toString())
                    }
                })
            }
        })
        
    }

    async onClose(): Promise<void> {
        // nothing to clean up    
    }
}