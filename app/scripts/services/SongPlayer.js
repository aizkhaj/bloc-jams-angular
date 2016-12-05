(function() {
    function SongPlayer($rootScope, Fixtures) {
        
        /**
        * @desc we declare an empty object assigning it to SongPlayer
        * @type {Object}
        */
        var SongPlayer = {};
        
        /**
        * @desc keep track of current album, from Fixtures.js
        * @type {Function}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
			  
			   currentBuzzObject.bind('timeupdate', function() {
					$rootScope.$apply(function() {
						SongPlayer.currentTime = currentBuzzObject.getTime();					
					});
				});
            
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc Does 2 things. Plays the currentBuzzObject and sets song.playing = true.
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        * @function stopSong
        * @desc private function to stop songs
        * @param {Object} song
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };
        
        /**
        * @function getSongIndex
        * @desc gets the index of a song from its album.
        * @param song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @desc holds current song from the clicked directive passed into this variable from the relative public functions.
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        
		/**
		* @desc Current playback time (in seconds) of currently playing song
		* @type {Number}
		*/
		SongPlayer.currentTime = null;
		
	    /**
		* @desc Holds volume of current song.
		* @type {Number}
		*/
	    SongPlayer.volume = 80;
	    
        /**
        * @function SongPlayer.play
        * @desc allows the user to engage the clicking directive that plays a targeted song.
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
            }
        };
        
        /**
        * @function SongPlayer.pause
        * @desc allows user to engage a click directive that pauses the targeted song.
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function SongPlayer.previous
        * @desc provides user ability to go to previous song, this func will be passed into a click directive.
        * @param {Object} song
        */
        SongPlayer.previous = function(song) {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
           
            if (currentSongIndex < 0) {
                setSong(song);
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function SongPlayer.next
        * @desc provides user ability to go to next song, this func will be passed into a click directive.
        * @param {Object} song
        */
        SongPlayer.next = function(song) {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
           if (currentSongIndex > currentAlbum.songs.length) {
                setSong(song);
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
		 
		 /**
		 * @function setCurrentTime
		 * @desc Set current time (in seconds) of currently playing song
		 * @param {Number} time
		 */
		 SongPlayer.setCurrentTime = function(time) {
			 if (currentBuzzObject) {
				 currentBuzzObject.setTime(time);
			 }
		 };
	   
	     SongPlayer.setVolume = function(volume) {
		 	if (currentBuzzObject) {
			   currentBuzzObject.setVolume(volume);
			}	
		 };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();