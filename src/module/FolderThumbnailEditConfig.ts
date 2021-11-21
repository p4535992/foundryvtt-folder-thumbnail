import { i18n, i18nFormat } from '../foundryvtt-folder-thumbnail';
import { FOLDER_THUMBNAIL_MODULE_NAME, getGame } from './settings';

export class FolderThumbnailEditConfig extends FormApplication {
  object: any;
  isEditDialog: boolean;

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = 'folder-thumbnail-folder-edit';
    options.template =  `modules/${FOLDER_THUMBNAIL_MODULE_NAME}/templates/folder-thumbnail-edit.html`,
    options.width = 500;
    return options;
  }

  get title() {
    //return this.isEditDialog ? `${i18n('FOLDER.Update')}: ${this.object.name}` : i18n('FOLDER.Create');
    return this.object.id ? `${i18n('FOLDER.Update')}: ${this.object.name}` : i18n('FOLDER.Create');
  }

  /** @override */
  async getData(options): Promise<any> {
    const folder = getGame().folders?.find((f:Folder) => f.id == this.object.id);
    const folderIcon = folder?.getFlag(FOLDER_THUMBNAIL_MODULE_NAME,'folderIcon');
    const folderIconOpen = folder?.getFlag(FOLDER_THUMBNAIL_MODULE_NAME,'folderIconOpen');
    return {
      name: this.object.id ? this.object.name : '',
      newName: i18nFormat('ENTITY.New', { entity: i18n(Folder.metadata.label) }),
      folder: this.object.data,
      safeColor: this.object.data.color ?? '#000000',
      sortingModes: { a: 'FOLDER.SortAlphabetical', m: 'FOLDER.SortManual' },
      submitText: i18n(this.object.id ? "FOLDER.Update" : "FOLDER.Create"),
    //   submitText: i18n(this.isEditDialog ? 'FOLDER.Update' : 'FOLDER.Create'),
      defaultFolder: this.object._id === 'default',
      deleteText: this.isEditDialog && this.object._id != 'default' ? 'Delete Folder' : null,
      folderIcon: folderIcon,
      folderIconOpen: folderIconOpen,
    };
  }

  /** @override */
  async _updateObject(event, formData) {
    if ( !formData.parent ) formData.parent = null;

    if (formData.folderIcon != null) {
        if (formData.folderIcon.length == 0) {
            this.object.data.folderIcon = null;
        } else {
            this.object.data.folderIcon = formData.folderIcon;
        }
    } else {
        this.object.data.folderIcon = null;
    }

    if (formData.folderIconOpen != null) {
        if (formData.folderIconOpen.length == 0) {
            this.object.data.folderIconOpen = null;
        } else {
            this.object.data.folderIconOpen = formData.folderIconOpen;
        }
    } else {
        this.object.data.folderIconOpen = null;
    }

    if ( !this.object.id ) {
        this.object.data.update(formData);
        return Folder.create(this.object.data);
    }

    // await this.object.save();
    // return;

    const folder = getGame().folders?.find((f:Folder) => f.id == this.object.id);
    await folder?.setFlag(FOLDER_THUMBNAIL_MODULE_NAME,'folderIcon',this.object.data.folderIcon);
    await folder?.setFlag(FOLDER_THUMBNAIL_MODULE_NAME,'folderIconOpen',this.object.data.folderIconOpen);

    return this.object.update(formData);
  }

  showDialog(edit = true) {
    this.isEditDialog = edit;
    this.render(true);
  }
}
