import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CutImageComponent } from "./components/cut-image/cut-image.component";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { MaterialModule } from "./material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { ValidationComponent } from "./components/validation/validation.component";
import { TranslateModule } from '@ngx-translate/core';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { PersonFormComponent } from './components/person-form/person-form.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { AddressManagerComponent } from './components/address-manager/address-manager.component';
import { PersonDocumentFormComponent } from './components/person-document-form/person-document-form.component';
import { PersonDocumentManagerComponent } from './components/person-document-manager/person-document-manager.component';
import { MemberFormComponent } from './components/member-form/member-form.component';
import { MemberManagerComponent } from './components/member-manager/member-manager.component';
import { AlbumManagerComponent } from './components/album-manager/album-manager.component';
import { AlbumFormComponent } from './components/album-form/album-form.component';
import { WorkManagerComponent } from './components/work-manager/work-manager.component';
import { WorkFormComponent } from './components/work-form/work-form.component';
import { PreferenceManagerComponent } from "@shared/components/preference-manager/preference-manager.component";
import { AddRPersonPreferenceComponent } from "@shared/components/preference-manager/add-person-preferences/add-person-preference.component";
import { SocialNetworkManagerComponent } from "@shared/components/social-network-manager/social-network-manager.component";
import { AddPersonSocialNetworkComponent } from "@shared/components/social-network-manager/add-social-network/add-person-social-network.component";
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { VideoLibraryManagerComponent } from "./components/video-library-manager/video-library-manager.component";
import { VideoLibraryFormComponent } from "./components/video-library-form/video-library-form.component";
import { AddArtistComponent } from "@modules/artist/components/artist/add-artist.component";
import { AddAddressComponent } from './components/address-manager/add-address/add-address.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { FuseWidgetModule, FuseConfirmDialogModule } from "@fuse/components";
import { TravelLogisticComponent } from './components/travel-logistic/travel-logistic.component';
import { AddTravelFlightComponent } from '././components/travel-logistic/add-travel-flight/add-travel-flight.component';
import { AddTravelHotelComponent } from './components/travel-logistic/add-travel-hotel/add-travel-hotel.component';
import { AddTravelTransportationComponent } from './components/travel-logistic/add-travel-transportation/add-travel-transportation.component';
import { AddTravelOtherComponent } from './components/travel-logistic/add-travel-other/add-travel-other.component';
import { CommentsManagerComponent } from './components/comments-manager/comments-manager.component';
import { MentionModule } from 'fvi-angular-mentions/mention';
import { AdditionalFieldComponent } from './components/additional-field/additional-field.component';
import { AddContactComponent } from './components/add-contact/add-contact.component';
import { AddTypeComponent } from "./components/add-type/add-type.component";
import { AddEditorComponent } from "@modules/general/components/editor/add-editor/add-editor.component";
import { NgxMaskModule } from "ngx-mask";
import { ReportComponent } from './components/report/report.component';
import { FileUploadModule } from 'ng2-file-upload';
import { UploadMultiFileComponent } from './components/upload-multi-file/upload-multi-file.component';
import { ProjectWorkComponent } from './components/project-work/project-work.component';
import { AddAlbumReleaseComponent } from './components/project-work/add-album-release/add-album-release.component';
import { AddProjectWorkComponent } from './components/project-work/add-project-work/add-project-work.component';
import { AddProjectWorkDetailsComponent } from './components/project-work/add-project-work-details/add-project-work-details.component';
import { AddRelationVideoworkComponent } from './components/project-work/add-relation-videowork/add-relation-videowork.component';
import { AddComposerComponent } from './components/project-work/add-composer/add-composer.component';
import { AddArtistModalComponent } from './components/project-work/add-artist-modal/add-artist-modal.component';
import { ProjectArtistEventComponent } from './components/project-artist-event/project-artist-event.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { AddWorkAdminComponent } from './components/project-work/add-work-admin/add-work-admin.component';
import { AddGeneralComposerComponent } from './components/add-general-composer/add-general-composer.component';
import { AddPublisherComponent } from '../modules/general/components/worksmanage/add-publisher/add-publisher.component';

const SHARED_COMPONENTS = [
    CutImageComponent,
    ConfirmComponent,
    ValidationComponent,
    ImagePreviewComponent,
    ImagePreviewComponent,
    PersonFormComponent,
    AddressFormComponent,
    UploadImageComponent,
    AddressManagerComponent,
    PersonDocumentFormComponent,
    PersonDocumentManagerComponent,
    MemberFormComponent,
    MemberManagerComponent,
    AlbumManagerComponent,
    WorkManagerComponent,
    WorkFormComponent,
    AlbumFormComponent,
    PreferenceManagerComponent,
    SocialNetworkManagerComponent,
    AddRPersonPreferenceComponent,
    AddPersonSocialNetworkComponent,
    VideoLibraryManagerComponent,
    VideoLibraryFormComponent,
    AlbumDetailComponent,
    AddArtistComponent,
    AddAddressComponent,
    UploadFileComponent,
    AddCompanyComponent,
    TravelLogisticComponent,
    AddTravelFlightComponent,
    AddTravelHotelComponent,
    AddTravelTransportationComponent,
    AddTravelOtherComponent,
    CommentsManagerComponent,
    AddContactComponent,
    AddTypeComponent,
    AdditionalFieldComponent,
    AddEditorComponent,
    ReportComponent,
    UploadMultiFileComponent,
    ProjectWorkComponent,
    AddAlbumReleaseComponent,
    AddProjectWorkComponent,
    AddProjectWorkDetailsComponent,
    AddRelationVideoworkComponent,
    AddComposerComponent,
    ProjectArtistEventComponent,
    ProjectDetailComponent,
    AddWorkAdminComponent,
    AddGeneralComposerComponent,
    AddArtistModalComponent,
    AddPublisherComponent
];

const SHARED_MODULES = [
    CommonModule,
    ImageCropperModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TranslateModule,
    NgImageSliderModule,
    FuseWidgetModule,
    FuseConfirmDialogModule,
    MentionModule,
];

@NgModule({
    imports: [
        ...SHARED_MODULES,
        NgxMaskModule.forRoot(),
        FileUploadModule,
    ],
    declarations: [...SHARED_COMPONENTS, AddWorkAdminComponent],
    exports: [...SHARED_COMPONENTS, ...SHARED_MODULES],
    entryComponents: [...SHARED_COMPONENTS]
})
export class SharedModule { }
