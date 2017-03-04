crate.controller('ArtistProfileCtrl', function($scope, $location, $routeParams, messenger, artistFactory, albumFactory, user, trackFactory, stereo){
  $scope.artist = {};
  $scope.albums = [];
  $scope.tracks = [];
  $scope.viewing = 'tracks';
  $scope.setView = function(view) {
    $scope.viewing = view;
  }

  $scope.init = function() {
    var artistId = $routeParams.id;
		artistFactory.getArtist(artistId).then(function(response){
			$scope.artist = response.data;
		});

    albumFactory.getAlbumsByArtistId(artistId)
    .then(function(response){
      $scope.albums = response.data;
    });

    trackFactory.getTracksByArtistId(artistId)
    .then(function(response){
      $scope.tracks = response.data;
    })
	};

  $scope.cueMyTracks = function() {
    $scope.artist.listType = 'artist-profile';
    stereo.activeList = $scope.artist;
    stereo.setActiveTracks($scope.tracks);
  };

  $scope.crateToggle = function(artist) {
    user.toggleCrateArtist(artist)
    .then(function(response) {
      if (response.data !== "removed") {
        artist.iLikeThis = true;
        messenger.show(artist.name + " added to your crate!");
      } else {
        artist.iLikeThis = false;
        messenger.show(artist.name + " removed from your crate.");
      }
    });
  };
});
