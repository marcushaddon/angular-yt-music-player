crate.controller('AlbumCtrl', function($scope, $location, $routeParams, config, stereo, messenger, user, trackFactory, playlistFactory, albumFactory){
  $scope.albumId = $routeParams.id;
  $scope.init = function() {

    albumFactory.getAlbum($scope.albumId)
    .then(function(response){
      $scope.album = response.data;
    });

    albumFactory.getTracksByAlbumId($scope.albumId)
    .then(function(response){
      // TODO figure out why this is broken
      var sortedTracks = trackFactory.sortTracksByTrackNos(response.data);
      $scope.tracks = sortedTracks;
    });

  };

  $scope.cueMyTracks = function() {
    // stereo.setActiveList($scope.album);
    stereo.setActiveList($scope.album);
    stereo.setActiveTracks($scope.tracks);
    albumFactory.incrementListens($scope.albumId);
  };

  $scope.albumImgPlaceHolder = config.albumImgPlaceHolder;
  $scope.userImgPlaceholder = config.userImgPlaceholder;

  // $scope.captureTrack = function(track) {
	// 	playlistFactory.capturedTrack = track;
	// 	angular.element('#bottomModal').openModal();
	// };



  $scope.saveAlbumAsPlaylist = function(album, tracks) {
		playlistFactory.saveAlbumAsPlaylist(album, tracks)
    .then(function(response){
      messenger.show(response.data.name + " created!");
    });
	};

  $scope.crateToggle = function(album) {
    user.toggleCrateAlbum(album)
    .then(function(response){
      if (response.data == "removed") {
        album.iLikeThis = false;
        messenger.show(album.name + " removed from your crate");
      } else {
        album.iLikeThis = true;
        messenger.show(album.name + " added to your crate!");
      }
    })
  };

  $scope.deleteAlbum = function() {
    var confirmed = confirm("Are you sure you want to delete " + $scope.album.name + "?");
    if (confirmed) {
      albumFactory.deleteAlbum($scope.album)
      .then(function(res) {
        $location.path('/');
      });
    }
  };

  // $scope.$on('trackPlayToggle', function(event){
  //   $scope.$emit('listPlayToggle', $scope.album);
  //   // event.stopPropagation();
  // });

});
