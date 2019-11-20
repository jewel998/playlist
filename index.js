console.clear();
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
var buttonColorOnPress = "white";
$(document).ready(function(){
$.getJSON('https://jewel998.github.io/playlist/playlist.json',function(data){
    var abort_other_json;
    var playlist = data;
    var index = 0;
    var indexing = playlist.songs[index];
    var time = 0;
    var totalTime = 0;
    var timeList = [];
    var play = 0;
    var counter = 0;
    var songRepeat = 0;
    var songShuffle = 0;
    var mute = 0;
    var stopTimer;
    var previousTime;
    var safeKill = 0;
    var audio = document.getElementById('audioFile');
    function centerize() {
        var a = $(".current").height();
        var c = $("#lyrics").height();
        var d = $(".current").offset().top - $(".current").parent().offset().top;
        var e = d + (a/2) - (c*1/4);
        $("#lyrics").animate(
            {scrollTop: e + "px"}, {easing: "swing", duration: 500}
        );
    }
    function next(){
        var current = $('#lyrics .current');
        if(current.length == 0){ $('#lyrics-content h2:nth-child(1)').addClass("current"); return; }
        current.removeClass('current');
        current.next().addClass('current');
    }
    function previous(){
        var current = $('#lyrics .current');
        if(current.length == 0){ return; }
        var first = $('#lyrics-content h2:nth-child(1)');
        current.removeClass('current');
        if(current === first){ return; }
        current.prev().addClass('current');
    }
    function setSongName(songName){
        var context = $('.song-name');
        for(var i=0;i<context.length;i++){
            context[i].innerHTML = songName;
        }
    }
    function setArtistName(artistName){
        var context = $('.artist-name');
        for(var i=0;i<context.length;i++){
            context[i].innerHTML = artistName;
        }
    }
    function setAlbumArt(albumart){
        var context = $('#album-art');
        context.attr("src",albumart);
    }
    function processTime(a){
        var b = parseInt(a/60000);
        var c = parseInt((a%60000)/1000);
        if(c < 10){ c = "0"+c; }
        return b+":"+c;
    }
    function reset(){
        time = 0;
        audio.currentTime = 0;
    }
    function playSong(){
        if(play==0){play = 1;audio.play();$('#menu button#play i').removeClass("fa-play");$('#menu button#play i').addClass("fa-pause");}
        else{play = 0;audio.pause();$('#menu button#play i').removeClass("fa-pause");$('#menu button#play i').addClass("fa-play");}
    }
    function processing(data){
        if(data.author == ""){ data.author = "Unknown"; }
        setSongName(data.song);
        setArtistName(data.author);
        setAlbumArt(data.albumart);
        var html = "";
        timeList=[];
        for(var i=0;i<data.lyrics.length;i++){
            timeList.push(data.lyrics[i].time);
            html = html + "<h2>"+data.lyrics[i].line+"</h2>";
        }
        $('#lyrics-content').html(html);
        $('#totalTime').html(processTime(totalTime));
        $('#currentTime').html(processTime(time));
        var percent = time/totalTime * 100;
        $('#progress').css("width",percent+"%");
    }
    $('#progress-bar').on('click',function(event){
        var width = $('#progress-bar').css("width");
        var percent = parseInt(event.offsetX)/parseInt(width)*100;
        $('#progress').css("width",percent+"%");
        time = parseInt(totalTime * (percent/100));
        audio.currentTime = parseInt(time/1000);
    });
    
    function rewind5s(){
        if(time > 5000)
            time = time - 5000;
        else
            time = 0;
        audio.currentTime = parseInt(time/1000);
    }
    function forward5s(){
        if((time+5000) < totalTime)
            time = time + 5000;
        else
            time = totalTime;
        audio.currentTime = parseInt(time/1000);
    }
    $(document).bind('keydown',function(event){
        switch(event.keyCode){
            case 37:
            rewind5s();
            break;
            case 39:
            forward5s();
            break;
        }
    });
    function toggleRepeat(){if(songRepeat == 0){$('#repeat').css("color",buttonColorOnPress);songRepeat=1;}else{$('#repeat').css("color","grey");songRepeat=0;}}function toggleShuffle(){if(songShuffle == 0){$('#shuffle').css("color",buttonColorOnPress);songShuffle = 1;}else{$('#shuffle').css("color","grey");songShuffle = 0;}}function toggleMute(){if(mute == 0){mute=1;audio.volume = 0;}else{mute = 0;audio.volume = 1;}}
    $(document).bind('keypress',function(event){
        //console.log(event.keyCode);
        switch(event.keyCode){
            case 32:
            playSong();
            break;
            case 109:
            toggleMute();
            break;
            case 114:
            toggleRepeat();
            break;
            case 115:
            toggleShuffle();
            break;
        }
    });
    function prevSong(){
        if(abort_other_json){abort_other_json.abort();}reset();timeList=[];previousTime=0;counter=0;
        clearInterval(stopTimer);
        index = (index-1)%playlist.songs.length;
        indexing = playlist.songs[index];
        $('#audioFile').attr('src',indexing.audio);
        loadSong();
    }
    function nextSong(){
        if(abort_other_json){abort_other_json.abort();}reset();timeList=[];previousTime=0;counter=0;
        clearInterval(stopTimer);
        index = (index+1)%playlist.songs.length;
        indexing = playlist.songs[index];
        $('#audioFile').attr('src',indexing.audio);
        loadSong(); 
    }
    function updateTimer(data){
        if(totalTime == 0 || isNaN(totalTime)){totalTime = parseInt((audio.duration * 1000));processing(data);}
        //for the end of the song
        if(time >= totalTime){if(play == 0) return; playSong(); if(songRepeat == 1){ reset(); playSong(); return; }else{ nextSong(); playSong(); } return;}
        //update timer
        if(play == 1){time = time + 1000;}
        else if(play == -1){time = 0;}
        //upadate time on the progress bar
        if(audio.currentTime != previousTime){previousTime=audio.currentTime;$('#currentTime').html(processTime(time));var percent = time/totalTime * 100;$('#progress').css("width",percent+"%");}
        else{ time = parseInt(audio.currentTime*1000);if(time>100)time=time-100;if(play==1){audio.pause();audio.play();} }
        safeKill = 0;
        while(true){
            safeKill += 1;
            if(safeKill >= 100) break;
            if(counter == 0){if(time < timeList[counter]){previous();break;}}
            if((counter == timeList.length) && (time <= timeList[counter-1])){counter--;previous();}
            if(time >= timeList[counter]){if(counter<=timeList.length){counter++;}next();}
            else if(time < timeList[counter-1]){counter--;previous();}
            else{if(play == 1)centerize();break;}
        }
    }
    function loadSong(){
        $('#audioFile').attr('src',indexing.audio);
        abort_other_json = $.getJSON(indexing.json,function(data){
            processing(data);
            totalTime = NaN;
            stopTimer = setInterval(function(){updateTimer(data);},1000);
        });
    }
    loadSong();
    $('#prev').on('click',prevSong);
    $('#next').on('click',nextSong);
    $('#play').on('click',playSong);
    $('#repeat').on('click',toggleRepeat);
    $('#shuffle').on('click',toggleShuffle);
    function playSongAtIndex(data){
        if(data == index) return;
        if(index >= playlist.songs.length) return;
        if(abort_other_json){abort_other_json.abort();reset();clearInterval(stopTimer);timeList=[];previousTime=0;counter=0;}
        index = data;
        indexing = playlist.songs[index];
        $('#audioFile').attr('src',indexing.audio);
        loadSong();
    }
    function addToPlayList(data,index){
        var html = "";html = $('#show-list').html();html +="<div class=\"float-song-card\" data-index=\""+index+"\"><img class=\"album-art\" src=\""+data.albumart+"\"><h2 class=\"song\">"+data.song+"</h2><h4 class=\"artist\">"+data.author+"</h4></div>";$('#show-list').html(html);$('.float-song-card').on('click',function(){playSongAtIndex($(this).attr("data-index"));});
    }
    function setPlaylist(){
        for(var i=0;i<playlist.songs.length;i++){
            $.getJSON(playlist.songs[i].json,function(i){ return function(data){addToPlayList(data,i)}; }(i));
        }
    }
    setPlaylist();
});
$('#search').keyup(function(){
    var toSearch = $(this).val();
    $('.float-song-card').css("display","none");
    $('.float-song-card:contains('+toSearch+')').css("display","inline-block");
});
var togglePlaylist = 0;
$('#back').on('click',function(){
  if(togglePlaylist == 0){
    $('#playlist').css("transform","translateX(0)");
    togglePlaylist = 1;
  }
  else{
    $('#playlist').css("transform","translateX(100%)");
    togglePlaylist = 0;
  }
});
});
