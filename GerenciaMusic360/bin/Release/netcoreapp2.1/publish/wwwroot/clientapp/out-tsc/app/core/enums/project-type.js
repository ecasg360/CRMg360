export var EEntityProjectType;
(function (EEntityProjectType) {
    EEntityProjectType[EEntityProjectType["AlbumRelease"] = 1] = "AlbumRelease";
    EEntityProjectType[EEntityProjectType["SingleRelease"] = 2] = "SingleRelease";
    EEntityProjectType[EEntityProjectType["VideoMusic"] = 3] = "VideoMusic";
    EEntityProjectType[EEntityProjectType["VideoLyricMusic"] = 4] = "VideoLyricMusic";
    //ContentVideo = 7,
    EEntityProjectType[EEntityProjectType["Event"] = 5] = "Event";
    EEntityProjectType[EEntityProjectType["ArtistSale"] = 6] = "ArtistSale";
})(EEntityProjectType || (EEntityProjectType = {}));
var ProjectTypesString = ['all', 'album_release', 'single_release', 'video_music', 'video_lyric_music', 'event', 'artist_sale' /*, 'content_video'*/];
export { ProjectTypesString };
//# sourceMappingURL=project-type.js.map