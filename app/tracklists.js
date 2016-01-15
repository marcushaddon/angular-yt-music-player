var plantasiaTracks = [
				{trackNum: 1, trackName : "Plantasia", albumName : "Plantasia", artistName : "Mort Garson", start : 0, stop : 196, runTime : function() {return this.stop - this.start;}},
				{trackNum: 2, trackName : "Symphony For A Spider Plant", albumName : "Plantasia", artistName : "Mort Garson", start : 196, stop : 350, runTime : function() {return this.stop - this.start;}},
				{trackNum: 3, trackName : "Baby's Tears Blues", albumName : "Plantasia", artistName : "Mort Garson", start : 350, stop : 527, runTime : function() {return this.stop - this.start;}},
				{trackNum: 4, trackName : "Ode To An African Violet", albumName : "Plantasia", artistName : "Mort Garson", start : 527, stop : 758, runTime : function() {return this.stop - this.start;}},
				{trackNum: 5, trackName : "Concerto For Philodendron & Pothos", albumName : "Plantasia", artistName : "Mort Garson", start : 758, stop : 940, runTime : function() {return this.stop - this.start;}},
				{trackNum: 6, trackName : "Rhapsody In Green", albumName : "Plantasia", artistName : "Mort Garson", start : 940, stop : 1140, runTime : function() {return this.stop - this.start;}},
				{trackNum: 7, trackName : "Swingin' Spathiphyllums", albumName : "Plantasia", artistName : "Mort Garson", start : 1140, stop : 1311, runTime : function() {return this.stop - this.start;}},
				{trackNum: 8, trackName : "You Don't Have To Walk A Begonia", albumName : "Plantasia", artistName : "Mort Garson", start : 1311, stop : 1457, runTime : function() {return this.stop - this.start;}},
				{trackNum: 9, trackName : "A Mellow Mood For Maidenhair", albumName : "Plantasia", artistName : "Mort Garson", start : 1457, stop : 1585, runTime : function() {return this.stop - this.start;}},
				{trackNum: 10, trackName : "Music To Soothe The Savage Snake Plant", albumName : "Plantasia", artistName : "Mort Garson", start : 1585, stop : 1784, runTime : function() {return this.stop - this.start;}},
			];

var kakashiTracks = [
			{trackNum: 1, trackName: "Suiren", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 0, stop: 275 , runTime : function() {return this.stop - this.start;}},
			{trackNum: 2, trackName: "Kakashi", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 275, stop: 558, runTime : function() {return this.stop - this.start;}},
			{trackNum: 3, trackName: "Kono Yo Ni Yomeri #1", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 558, stop : 738, runTime : function() {return this.stop - this.start;}},
			{trackNum: 4, trackName: "Semitori", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 738, stop: 1020 , runTime : function() {return this.stop - this.start;}},
			{trackNum: 5, trackName: "Kono Yo Ni Yomeri #2", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 1020, stop : 1154, runTime : function() {return this.stop - this.start;}},
			{trackNum: 6, trackName: "Yune Dewa", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 1154, stop : 1437, runTime : function() {return this.stop - this.start;}},
			{trackNum: 7, trackName: "Umi No Ue Kara", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 1437, stop : 1939, runTime : function() {return this.stop - this.start;}},
			{trackNum: 8, trackName: "Utukushiki Tennen", albumName: "Kakashi" , artistName: "Yasuaki Shimizu", start: 1939, stop : 2220, runTime : function() {return this.stop - this.start;}},
			];

var playlists = [{artistName: 'Mort Garson', albumName: 'Plantasia', tracks: plantasiaTracks},
				 {artistName: 'Takeshi Taruchi and Bunnies', albumName: "Seichô Takeuchi Bushi", tracks: null},
				 {artistName: 'Yasuaki Shimizu', albumName:'Kakashi', tracks: kakashiTracks}
			];