// FOR WHEN WE GET YOUTUBE DESCRIPTIONS, HERE IS THE REGEX TO FIND TIMES /[0-9]{1,3}:[0-9]{2}/g
crate.factory('uploadFactory', function($http, $location, discogsFactory, youtubeFactory, artistFactory, albumFactory, trackFactory, messenger){
  return {
    processingComplete: false,
    progressUpdates: [],
    nextStop: null,

    checkCrateForArtist: function(artist) {
      return $http({
        method: 'GET',
        url: '/api/search/artist/' + artist
      });
    },

    convertDiscogsTracklist: function(tracklist, album, artist, videoId) {
      console.log("tracks comin in");
      console.log(tracklist);

      var crateTracklist = [];
      // filter to remove heading entries
      // we might want to check to see if it has the type_ attribute first...
      tracklist = tracklist.filter(function(track){
        return track.type_ == "track";
      });
      var weHaveDurations = true;
      // Make sure every track has a duration
      for (track in tracklist) {
        if (tracklist[track].duration === "") {
          weHaveDurations = false;
        }
      }
      // Make our track
      for (track in tracklist) {
        var discTrack = tracklist[track];
        var crateTrack = {
          trackNum: parseInt(track) + 1,
          trackName: discTrack.title,
          albumName: album.name,
          albumId: album._id,
          artist: artist.name,
          artistId: artist._id,
          videoId: videoId,
          favorites: 0,
          listens: 0
        };
        crateTracklist.push(crateTrack);
      }
      // Now assign begin and stop times...
      for (track in crateTracklist) {
        if (weHaveDurations) {
          // Get corresponding discogs track object...
          var discogsTrack = tracklist[track];
          var durationArray = discogsTrack.duration.split(':');
          var durationSeconds = parseFloat(durationArray[0]) * 60 + parseFloat(durationArray[1]);
          if (track > 0) {
            crateTracklist[track].begin = crateTracklist[track - 1].stop;
          } else {
            crateTracklist[track].begin = 0;
          }
          crateTracklist[track].stop = crateTracklist[track].begin + durationSeconds;
        } else {
          crateTracklist[track].begin = null;
          crateTracklist[track].stop = null;
        }
      }

      return crateTracklist;
    },

    getVideoInfo: function(videoId) {
      var factory = this;
      videoId = videoId || factory.videoId;
      return youtubeFactory.getVideoInfo(videoId)
      .then(function(response){
        factory.videoInfo = response.data.items[0].snippet;
      })
    },

    makeTracksFromVideoInfo: function(dumb) {
      dumb = dumb || false;
      var factory = this;
      var desc = this.videoInfo.description;

      var tracksArray = [];
      var descLines = desc.split('\n');

      var firstSongLine = -1;
      for (line in descLines) {
        var timeStringArray = descLines[line].match(/([0-9]{1,2}:)*[0-9]{1,2}:[0-9]{2}/g);
        if (timeStringArray !== undefined && timeStringArray !== null) {
          // Bookmark the first place we find a time, in case the first song didnt have a time
          if (firstSongLine === -1) { firstSongLine = line };
          // Convert that string into an ISO time stamp
          var intArray = timeStringArray[0].split(":").map(function(s){ return parseInt(s); });
          // If we have an hours place
          if (intArray.length === 3) {
            var isoTime = intArray[0] * 60 * 60 + intArray[1] * 60 + intArray[2];
          } else {
            var isoTime = intArray[0] * 60 + intArray[1];
          }

          // Now lets go get the track name
          var trackName = descLines[line].replace(timeStringArray[0], '');
          if (dumb) {

            var dumbBegin = tracksArray.length > 0 ? tracksArray[tracksArray.length - 1].stop : 0;
            var dumbStop = dumbBegin + isoTime;
          }
          var youtubeTrack = {
            // We have to calculate this later
            trackNum: null,
            trackName: trackName,
            albumName: factory.album.name,
            albumId: factory.album._id,
            artist: factory.artist.name,
            artistId: factory.artist._id,
            videoId: factory.videoId,
            begin: !dumb ? isoTime : dumbBegin,
            // Also gotta calc this later
            stop: !dumb ? null : dumbStop,
            favorites: 0,
            listens: 0
          };
          // Put it in our track collection
          tracksArray.push(youtubeTrack);
        }
      }

      // NOW CHECK TO SEE IF WEE NEED A FIRST track
      // VERY IMPROTATN
      if (tracksArray.length > 0 && tracksArray[0].begin !== 0) {
        var trackName = descLines[firstSongLine - 1];
        tracksArray.unshift({
            // We have to calculate this later
            trackNum: null,
            trackName: trackName,
            albumName: factory.album.name,
            albumId: factory.album._id,
            artist: factory.artist.name,
            artistId: factory.artist._id,
            videoId: factory.videoId,
            begin: 0,
            // Also gotta calc this later
            stop: null,
            favorites: 0,
            listens: 0
          });
      }

      // Now calc end times (of all but last track) AND ASSIGN TRACK NUMS
      for (var index = 0, length = tracksArray.length; index < length - 1; index++) {
        tracksArray[index].stop = tracksArray[index + 1].begin;
        tracksArray[index].trackNum = index + 1;
      }
      if (tracksArray.length > 0) {
        tracksArray[tracksArray.length - 1].trackNum = tracksArray.length;

      }

      if (!dumb) {
        // assign last time
        return youtubeFactory.getVideoDuration(factory.videoId)
            .then(function(response){
              if (tracksArray.length > 0) {
                factory.videoDuration = response.data;
                tracksArray[tracksArray.length - 1].stop = response.data;

              }
              factory.youtubeTracks = tracksArray;
            });
      } else {
        console.log("UPLOADER IS DUMB");
        if (tracksArray.length > 0) {
          tracksArray[tracksArray.length - 1].stop = factory.videoDuration;
          factory.youtubeTracks = tracksArray;
        }

      }




    },


    // discogsFactory.getArtist(discogsArtistId)
    // .then(function(response){
    //   var discArtist = response.data;
    //   // Create the new artist
    //   // Just in case the artist doesnt have an images array
    //   var image = discArtist.images !== undefined ? discArtist.images[0].resource_url : null;
    //   var imgs = discArtist.images? discArtist.images : [];
    //   var link = discArtist.urls ? discArtist.urls[0] : discArtist.uri;
    //   var crateArtist = {
    //     name: discArtist.name.replace(/\s\(\d+\)/gi, ''),
    //     bio: discArtist.profile,
    //     link: link,
    //     imgUrl: image,
    //     imgs: imgs,
    //     discogsId: discArtist.id,
    //     discogsUrl: discArtist.resource_url,
    //     discogsUri: discArtist.resource_uri,
    //     aka: discArtist.namevariations,
    //     tags: [],
    //     favorites: 0,
    //     listens: 0
    //   };


    useDiscogsEntity: function(entity) {
      var factory = this;
      if (factory.videoId === '') {
        messenger.show("Woops! Looks like you forgot to enter the Youtube URL!");
      }
      // Get the full result for the album/master entity
      discogsFactory.getAlbum(entity.id, entity.type)
      .then(function(response) {
        var master = response.data;
        var discogsArtistId = master.artists[0].id;
        // Get discogs info on the artist
        discogsFactory.getArtist(discogsArtistId)
        .then(function(response){
          var discArtist = response.data;
          // Create the new artist
          // Just in case the artist doesnt have an images array
          var image = discArtist.images !== undefined ? discArtist.images[0].resource_url : null;
          var imgs = discArtist.images? discArtist.images : [];
          var link = discArtist.urls ? discArtist.urls[0] : discArtist.uri;
          var crateArtist = {
            name: discArtist.name.replace(/\s\(\d+\)/gi, ''),
            bio: discArtist.profile,
            link: link,
            imgUrl: image,
            imgs: imgs,
            discogsId: discArtist.id,
            discogsUrl: discArtist.resource_url,
            discogsUri: discArtist.resource_uri,
            aka: discArtist.namevariations,
            tags: [],
            favorites: 0,
            listens: 0
          };
          artistFactory.maybeCreateArtist(crateArtist)
          .then(function(response) {
            factory.artist = response.data;
            factory.createAlbumFromMaster(master);
          });
        });
      });


    },
//                       factory.createAlbumFromMaster(master);
    createAlbumFromMaster: function(master) {
      var factory = this;
      factory.progressUpdates.push("Creating album from Discogs info...");

      if (master.styles && master.genres) {
        var tags = master.styles.concat(master.genres);
      } else {
        var tags = [];
      }

      if (master.images) {
        var albumImg = master.images[0].resource_url;
      }

      if (master.notes) {
        var notes = master.notes;
      } else {
        var notes = '';
      }

      if (master.artists.length > 1) {
        var contributers = master.artists;
      }

      if (master.extraartists) {
        if (contributers) {
          contributers = contributers.concat(master.extraartists);
        } else {
          var contributers = master.extraartists;
        }
      }

      var album = {
          listType: 'album',
          name: master.title,
          artist: factory.artist.name,
          artistId: factory.artist._id,
          noTracks: master.tracklist.length,
          // THROWIN ERRORS CHECK TOSEE IF THEY EXIST
          imgUrl: albumImg,
          // THIS JUST RETURNS THELENGTH OF THE ARRAY, NOT COOL OK
          tags: tags,
          genres: master.genres,
          contributers: contributers || [],
          notes: master.notes,
          year: master.year,
          country: master.country,
          discogsId: master.id,
          discogsUrl: master.resource_url,
          discogsUri: master.uri
        };

        // AND HERE WE WILL SAVE THE ALBUM...
        albumFactory.maybeCreateAlbum(album)
        .then(function(response){
          var maybeCreatedAlbum = response.data;
          if (maybeCreatedAlbum.status === 'complete') {
            messenger.show("Oops! It looks like somone has already found that album!!");
            $location.path('/album/' + response.data._id);
            return false;
          }
          factory.album = response.data;
          // Now let's have a look at the tracks!!!
          factory.progressUpdates.push("Converting Discogs master track information...");
          // convert these tracks
          factory.tracks = factory.convertDiscogsTracklist(master.tracklist, factory.album, factory.artist, factory.videoId);

            // Lets see if the youtube description has track times in it....
            factory.makeTracksFromVideoInfo(false)
            .then(function() {
              if (!factory.validateTrackTimes(factory.youtubeTracks)) {
                // If their track times don't make sense, try it again in idiot mode...
                factory.makeTracksFromVideoInfo(true);
              }
              if (factory.youtubeTracks.length >= factory.tracks.length && factory.validateTrackTimes(factory.youtubeTracks)) {
                // If the num of tracks match, use youtube times, but discogs titles
                console.log("We are using youtubes tracks!");

                if (factory.youtubeTracks.length == factory.tracks.length) {
                  console.log("Using discogs names!");
                  for (track in factory.youtubeTracks) {
                    factory.youtubeTracks[track].trackName = factory.tracks[track].trackName;
                  }
                }
                // If not, just use youtubes...
                trackFactory.createTracks(factory.youtubeTracks)
                .then(function(){
                  factory.progressUpdates.push("We were able to get everything we needed from Youtube! Here's the album!");
                  factory.nextStop = '#/album/' + factory.album._id;
                  factory.processingComplete = true;
                });

              } else {
                if (factory.tracks[0].begin !== null) {
                  trackFactory.createTracks(factory.tracks)
                  .then(function(result){
                    factory.progressUpdates.push("We were able to get everything we needed from Discogs! Here's the album!");
                    factory.nextStop = '#/album/' + factory.album._id;
                    factory.processingComplete = true;
                  });
                } else if (factory.validateTrackTimes(factory.youtubeTracks)) {
                  factory.createTracks(factory.youtubeTracks)
                  .then(function(response) {
                    factory.progressUpdates.push("We got everything we needed from Youtube!");
                    factory.nextStop = '#/album/' + factory.album._id;
                    factory.processingComplete = true;
                  });
                } else {
                  // Persist pending tracks from discogs tracks (if they exist, other wise just make a stand in track)
                  if (factory.tracks.length < 1) {
                    trackFactory.tracks = [{
                      albumId: factory.album._id,
                      artistId: factory.artist._id,
                      album: factory.album.name,
                      artist: factory.artist.name,
                      trackName: "Track 1",
                      trackNum: 1
                    }];
                  }
                  trackFactory.createPendingTracks(factory.tracks)
                  .then(function(response) {
                    var albumId = response.data;
                    if (angularConfig.context == 'web') {
                      factory.progressUpdates.push("We just need a few more things from you...");
                      factory.processingComplete = true;
                      factory.nextStop = '#/upload/add-break-points?albumId=' + albumId;
                    } else if (angularConfig.context == 'extension') {
                      chrome.tabs.create({
                        url: angularConfig[angularConfig.environment] + '#/upload/add-break-points?albumId=' + albumId
                      });
                    }

                  });

                }
            }

        });
    })

  },

    createTracks: function(tracks) {
      return trackFactory.createTracks(tracks);

    },

    validateTrackTimes: function(tracks) {
      if (tracks.length === 0) return false;
      console.log("Validation being performed on youtube tracks");
      for (track in tracks) {
        if (track > 0) {
            if (tracks[track].begin < tracks[track - 1].stop) {
              console.log("Youtube tracks failed validation");
              return false;
            }
        }
        if (tracks[track].stop < tracks[track].begin) {
          console.log("Youtube tracks failed validation");

          return false;
        }


      }
      console.log("Youtube tracks passed validation");
      return true;
    },

    videoId: '',
    artist: {},
    album: {},
    tracks: [],
    videoInfo: {},
    youtubeTracks: {}
  }
});
