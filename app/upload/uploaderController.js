crate.controller('Uploader', function($scope, config, stereo, discogsFactory, uploadFactory, messenger){
	$scope.videoId = '';
	$scope.albumNmae = '';
	$scope.artistName = '';
	$scope.possibleMasters = [];

	// $scope.getTrackCandidates = function() {
	// 	return uploadFactory.tracks;
	// };

	$scope.checkDiscogsForUpload = function() {
		// There must be a urlStringEncode method or something
		discogsFactory.searchForRelease($scope.artistName + ' ' + $scope.albumName)
		.then(function(response){
			$scope.possibleMasters = response.data.results;

		})
	};

	$scope.useDiscogsMaster = function(master) {
		uploadFactory.videoId = $scope.videoId;
		uploadFactory.useDiscogsMaster1(master)

	};

	$scope.artistImgPlaceholder = config.artistImgPlaceholder;


});
