crate.controller('FrontPageCtrl', function($scope, $location, config, tagFactory, albumFactory, playlistFactory, messenger) {
  $scope.tagPageSize = 10;
  $scope.listPageSize = 3;
  $scope.latestAlbums    = [];
  $scope.latestPlaylists = [];
  $scope.topTags = [];
  $scope.tagsFinished = false;
  $scope.tagsAreDone = function() { return $scope.tagsFinished; };
  $scope.today = new Date();

  $scope.albumImgPlaceHolder = config.albumImgPlaceHolder;

  $scope.moreTags = function() {
    var currentPage = $scope.topTags.length / $scope.tagPageSize;
    console.log(currentPage);
    tagFactory.getTopTags(currentPage + 1, $scope.tagPageSize)
    .then(function(response){
      if (response.data.length < $scope.tagPageSize) {
        $scope.tagsFinished = true;
      } else {
        $scope.topTags = $scope.topTags.concat(response.data);
      }

    });
  };

  $scope.init = function() {
    albumFactory.getLatestAlbums($scope.listPageSize,0).then(function(response){
      $scope.latestAlbums = response.data;
    });

    playlistFactory.getLatestPlaylists($scope.listPageSize, 0).then(function(response){
      $scope.latestPlaylists = response.data;
    });

    tagFactory.getTopTags(1, $scope.tagPageSize)
    .then(function(response){
      $scope.topTags = response.data;
    })
  };

  $scope.getMoreAlbums = function() {
    var place = $scope.latestAlbums.length;
    albumFactory.getLatestAlbums($scope.listPageSize, place)
    .then(function(response) {
      $scope.latestAlbums = $scope.latestAlbums.concat(response.data);
    });
  };

  $scope.getMorePlaylists = function() {
    var place = $scope.latestPlaylists.length;
    playlistFactory.getLatestPlaylists($scope.listPageSize, place)
    .then(function(response) {
      $scope.latestPlaylists = $scope.latestPlaylists.concat(response.data);
    });
  }
});
