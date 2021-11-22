import { i18n, i18nFormat } from '../foundryvtt-folder-thumbnail';
import { FOLDER_THUMBNAIL_MODULE_NAME, getGame } from './settings';

export class FolderThumbnailEditConfig extends FormApplication {
  object: any;
  isEditDialog: boolean;

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = 'folder-thumbnail-folder-edit';
    (options.template = `modules/${FOLDER_THUMBNAIL_MODULE_NAME}/templates/folder-thumbnail-edit.html`),
      (options.width = 500);
    return options;
  }

  get title() {
    //return this.isEditDialog ? `${i18n('FOLDER.Update')}: ${this.object.name}` : i18n('FOLDER.Create');
    return this.object.id ? `${i18n('FOLDER.Update')}: ${this.object.name}` : i18n('FOLDER.Create');
  }

  /** @override */
  async getData(options): Promise<any> {
    const folder = getGame().folders?.find((f: Folder) => f.id == this.object.id);

    const data = <any>folder?.getFlag(FOLDER_THUMBNAIL_MODULE_NAME, 'folderIcon');
    const folderIcon = data?.folderIcon;
    const folderIconOpen = data?.folderIconOpen;
    const folderIconFontAwesome = data?.folderIconFontAwesome;
    const folderIconFontAwesomeOpen = data?.folderIconFontAwesomeOpen;
    const folderIconUseIconInsteadImage = data?.folderIconUseIconInsteadImage;

    return {
      name: this.object.id ? this.object.name : '',
      newName: i18nFormat('ENTITY.New', { entity: i18n(Folder.metadata.label) }),
      folder: this.object.data,
      safeColor: this.object.data.color ?? '#000000',
      sortingModes: { a: 'FOLDER.SortAlphabetical', m: 'FOLDER.SortManual' },
      submitText: i18n(this.object.id ? 'FOLDER.Update' : 'FOLDER.Create'),
      //   submitText: i18n(this.isEditDialog ? 'FOLDER.Update' : 'FOLDER.Create'),
      defaultFolder: this.object._id === 'default',
      deleteText: this.isEditDialog && this.object._id != 'default' ? 'Delete Folder' : null,
      folderIcon: folderIcon ?? 'icons/svg/mystery-man.svg',
      folderIconOpen: folderIconOpen ?? 'icons/svg/mystery-man.svg',
      folderIconFontAwesome: folderIconFontAwesome ?? 'fa-folder',
      folderIconFontAwesomeOpen: folderIconFontAwesomeOpen ?? 'fa-folder-open',
      folderIconUseIconInsteadImage: folderIconUseIconInsteadImage ?? false,
    };
  }

  /** @override */
  async _updateObject(event, formData) {
    if (!formData.parent) formData.parent = null;

    if (formData.folderIcon != null) {
      if (formData.folderIcon.length == 0) {
        this.object.data.folderIcon = null;
      } else {
        this.object.data.folderIcon = formData.folderIcon;
      }
    } else {
      this.object.data.folderIcon = null;
    }
    if(this.object.data.folderIcon == 'icons/svg/mystery-man.svg'){
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
    if(this.object.data.folderIconOpen == 'icons/svg/mystery-man.svg'){
      this.object.data.folderIconOpen = null;
    }

    if (formData.folderIconFontAwesome != null) {
      if (formData.folderIconFontAwesome.length == 0) {
        this.object.data.folderIconFontAwesome = null;
      } else {
        this.object.data.folderIconFontAwesome = formData.folderIconFontAwesome;
      }
    } else {
      this.object.data.folderIconFontAwesome = null;
    }
    if(this.object.data.folderIconFontAwesome == 'fa-folder'){
      this.object.data.folderIconFontAwesome = null;
    }

    if (formData.folderIconFontAwesomeOpen != null) {
      if (formData.folderIconFontAwesomeOpen.length == 0) {
        this.object.data.folderIconFontAwesomeOpen = null;
      } else {
        this.object.data.folderIconFontAwesomeOpen = formData.folderIconFontAwesomeOpen;
      }
    } else {
      this.object.data.folderIconFontAwesomeOpen = null;
    }
    if(this.object.data.folderIconFontAwesomeOpen == 'fa-folder-open'){
      this.object.data.folderIconFontAwesomeOpen = null;
    }

    if (formData.folderIconUseIconInsteadImage != null) {
      if (formData.folderIconUseIconInsteadImage.length == 0) {
        this.object.data.folderIconUseIconInsteadImage = null;
      } else {
        this.object.data.folderIconUseIconInsteadImage = formData.folderIconUseIconInsteadImage;
      }
    } else {
      this.object.data.folderIconUseIconInsteadImage = null;
    }

    if (!this.object.id) {
      this.object.data.update(formData);
      return Folder.create(this.object.data);
    }

    // await this.object.save();
    // return;

    const folder = getGame().folders?.find((f: Folder) => f.id == this.object.id);
    if (this.object.data.folderIcon) {
      await folder?.setFlag(FOLDER_THUMBNAIL_MODULE_NAME, 'folderIcon', 
        {
          folderIcon: this.object.data.folderIcon,
          folderIconOpen: this.object.data.folderIconOpen,
          folderIconFontAwesome: this.object.data.folderIconFontAwesome,
          folderIconFontAwesomeOpen: this.object.data.folderIconFontAwesomeOpen,
          folderIconUseIconInsteadImage : this.object.data.folderIconUseIconInsteadImage
        }
      );
    }
    return this.object.update(formData);
  }

  showDialog(edit = true) {
    this.isEditDialog = edit;
    this.render(true);
  }

  // /** @override */
  // activateListeners(html) {
  //   // Click to open
  //   const list = html.find('.directory-list');
  //   if (list.length) {
  //     list.children().each(function () {
  //       if ($(this).hasClass('folder')) {
  //         const idFolder = $(this).attr('data-folder-id');
  //         const folder = getGame().folders?.find((f: Folder) => f.id == idFolder);
  //         // const folderIcon = folder?.data.folderIcon;
  //         const folderIcon = folder?.getFlag(FOLDER_THUMBNAIL_MODULE_NAME, 'folderIcon');
  //         const folderIconOpen = folder?.getFlag(FOLDER_THUMBNAIL_MODULE_NAME, 'folderIconOpen');
  //         //@ts-ignore
  //         if (!folder?.expanded && folderIcon) {
            
  //         } else if (folder?.expanded && folderIconOpen) {

  //         }
  //       }
  //     }
  //   }
  // }
}
