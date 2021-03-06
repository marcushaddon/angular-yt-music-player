crate.controller('FrontPageCtrl', function($scope, $location, config, tagFactory, albumFactory, playlistFactory, messenger) {
  $scope.tagPageSize = 10;
  $scope.listPageSize = 3;
  $scope.albumPage = 1;
  $scope.popularAlbumsPage = 1;
  $scope.playlistPage = 1;
  $scope.latestAlbums    = [];
  $scope.latestPlaylists = [];
  $scope.popularAlbums   = [];
  $scope.viewPopularAlbums = [];
  $scope.viewAlbums      = [];
  $scope.viewPlaylists   = [];
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
    albumFactory.getLatestAlbums($scope.listPageSize, $scope.albumPage)
    .then(function(response){
      $scope.latestAlbums = response.data;
      $scope.viewAlbums = $scope.latestAlbums.slice(($scope.albumPage - 1) * $scope.listPageSize, $scope.listPageSize);
    });

    albumFactory.getTopAlbums($scope.listPageSize, $scope.popularAlbumsPage)
    .then(function(response) {
      $scope.popularAlbums = response.data;
      $scope.viewPopularAlbums = $scope.popularAlbums.slice(($scope.popularAlbumsPage - 1) * $scope.listPageSize, $scope.listPageSize);
    });

    playlistFactory.getLatestPlaylists($scope.listPageSize, $scope.playlistPage)
    .then(function(response){
      $scope.latestPlaylists = response.data;
      $scope.viewPlaylists = $scope.latestPlaylists.slice($scope.playlistPage - 1, $scope.listPageSize);
    });

    tagFactory.getTopTags(1, $scope.tagPageSize)
    .then(function(response){
      $scope.topTags = response.data;
    })
  };

  $scope.makeGoToPageFunction = function (
    pageCursor,
    viewCollection,
    collection
  ) {
    return function() {
      console.log('i am a function that changes tghe ' + pageCursor);
      var newBegin = (($scope[pageCursor] - 1) * $scope.listPageSize);
      var newEnd = newBegin + $scope.listPageSize;
      $scope[viewCollection] = $scope[collection].slice(newBegin, newEnd);
    }
  };

  $scope.goToAlbumPage = $scope.makeGoToPageFunction('albumPage', 'viewAlbums', 'latestAlbums');
  $scope.goToPlaylistPage = $scope.makeGoToPageFunction('playlistPage', 'viewPlaylists', 'latestPlaylists');
  $scope.goToPopularAlbumsPage = $scope.makeGoToPageFunction('popularAlbumPage', 'viewPopularAlbums', 'popularAlbums');



  $scope.getMorePopularAlbums = function() {
    var place = $scope.popularAlbums.length / $scope.listPageSize + 1;
    return albumFactory.getTopAlbums($scope.listPageSize, place)
    .then(function(response) {
      $scope.popularAlbums = $scope.popularAlbums.concat(response.data);
    });
  };

  $scope.nextPageOfPopularAlbums = function() {
    // See if there are more albums in our queue, or if we need more
    var needMore = $scope.popularAlbums.length <= ($scope.listPageSize * $scope.popularAlbumsPage);
    $scope.popularAbumPage++;
    if (needMore) {
      $scope.getMorePopularAlbums()
      .then(function success(response) {
        $scope.goToPopularAlbumsPage($scope.albumPage);
      });
    } else {
      $scope.goToPopularAlbumsPage($scope.popularAlbumsPagealbumPage);
    }
  };

  $scope.getMoreAlbums = function() {
    var place = $scope.latestAlbums.length / $scope.listPageSize + 1;
    return albumFactory.getLatestAlbums($scope.listPageSize, place)
    .then(function(response) {
      $scope.latestAlbums = $scope.latestAlbums.concat(response.data);
    });
  };

  $scope.nextPageOfAlbums = function() {
    // See if there are more albums in our queue, or if we need more
    var needMore = $scope.latestAlbums.length <= ($scope.listPageSize * $scope.albumPage);
    console.log("needmore: " + needMore);
    $scope.albumPage++;
    if (needMore) {
      $scope.getMoreAlbums()
      .then(function success(response) {
        $scope.goToAlbumPage($scope.albumPage);
      });
    } else {
      $scope.goToAlbumPage($scope.albumPage);
    }
  };

  $scope.lastPageOfAlbums = function() {
    console.log($scope.albumPage);
    if ($scope.albumPage < 2) {
      console.log("begining");
      return;
    }
    $scope.albumPage--;
    $scope.goToAlbumPage();
  };

  $scope.lastPageOfPlaylists = function() {
    if ($scope.playlistPage < 2) {
      return;
    }
    $scope.playlistPage--;
    $scope.goToPlaylistPage();
  };

  $scope.nextPageOfPlaylists = function() {
    // See if there are more albums in our queue, or if we need more
    var needMore = $scope.latestPlaylists.length <= ($scope.listPageSize * $scope.playlistPage);
    console.log("needmore: " + needMore);
    $scope.playlistPage++;
    if (needMore) {
      $scope.getMorePlaylists()
      .then(function success(response) {
        $scope.goToPlaylistPage();
      });
    } else {
      $scope.goToPlaylistPage();
    }
  };

  $scope.getMorePlaylists = function() {
    var place = $scope.latestPlaylists.length;
    return playlistFactory.getLatestPlaylists($scope.listPageSize, place)
    .then(function(response) {
      $scope.latestPlaylists = $scope.latestPlaylists.concat(response.data);
    });
  };
});
