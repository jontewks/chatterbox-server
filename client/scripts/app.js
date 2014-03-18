// YOUR CODE HERE:
/* global $, _ */

var App = function(){
	this.user = window.location.search.slice(10);
	this.friends = {};
	this.message = {
		'username': 'Chef',
		'text': 'hello Children',
		'roomname': 'lurker'
	};

};

// message template
App.prototype.messageTemplate = function(user, text, room){
	var userSpan = '<a href="#" class="'+user+'">'+user+'</a><br/>';
	var textSpan = '<span class="'+text+'">'+text+'</span><br/>';
	var roomSpan = '<span class="'+room+'">'+room+'</span>';
	var message = $('<p>User:' + userSpan +'Text: ' + textSpan + 'Room: ' + roomSpan +  '</p>');
	return message;
};

// sanitize input string
App.prototype.sanitize = function(string){
	var symbols = {
		'&' : '&amp;',
		'<' : '&lt;',
		'"' : '&quot;',
		'>' : '&gt;',
		'/' : ''
	};
	for (var key in symbols) {
		var regex = new RegExp('ReGeX' + key + 'ReGeX');
		string.replace(regex, symbols[key]);
	}
	return string;
};

//create list of rooms to select from
App.prototype.listRooms = function(rooms){
	for (var key in rooms){
		$('#rooms').append('<option value="'+key+'">'+key+'</option>');
		$('#selectRoom').append('<option value="'+key+'">'+key+'</option>');
	}
};

// store friends
App.prototype.storeFriends = function(friend){
	this.friends[friend] = friend;
	$('#friendsBox a').remove();
	for (var key in this.friends) {
		var addFriend = $('<a href="#" class="'+key+'">'+key+'</a>');
		$('#friendsBox').append(addFriend);
	}
};

// check friends
App.prototype.checkFriends = function(){
	var that = this;
	$.each($('p'), function(){
		var friend = $(this).find('a').html();
		if (that.friends[friend]) {
			$(this).children().css({
				'font-weight': 'bold'
			});
		}
	});
}

// filter by room
App.prototype.filterRoom = function(roomName){
	var spanArray = $('p');
	$.each(spanArray, function(){
		if (!$(this).find('span').hasClass(roomName)) {
			$(this).fadeOut('fast');
		} else {
			$(this).fadeIn();
		}
	});
};


// function to call on successful retreival of data
App.prototype.retrieveOnSuccess = function(resultData){
	$('#messagesDiv p').remove();
	var that = this;
	var rooms = {};
	resultData = _.sortBy(resultData, 'createdAt');
	_.each(resultData, function(item) {
		var room = $('<span>'+item.roomname+'</span>').text();
		room = that.sanitize(room);
		rooms[room] = room;
		var text = $('<span>'+item.text+'</span>').text();
		text = that.sanitize(text);
		var user = $('<span>'+item.username+'</span>').text();
		user = that.sanitize(user);
		var message = that.messageTemplate(user, text, room);
		$('#messagesDiv').prepend(message);
		that.checkFriends();
	});
	that.listRooms(rooms);
};


// retrieve messages
App.prototype.retrieve = function(){
	var that = this;
	$.ajax({
		url: 'http://127.0.0.1:3000/classes/messages',
		type: 'GET',
		//data: {'order':'-createdAt'},
		contentType: 'application/json',
		success: function(data){
			console.log('message recieved!');
			that.retrieveOnSuccess(data.results);
			if ($('#rooms').val() !== 'All Rooms') {
				that.filterRoom($('#rooms').val());
			} else {
				$('p').show();
			}
		},
		error: function (data) {
			console.error('messages: Failed to get message');
		}
	});
};



// send messages
App.prototype.send = function(message) {
	$.ajax({
		url: 'https://127.0.0.1:3000/classes/messages',
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function (data) {
			console.log('messages: Message sent');
		},
		error: function (data) {
			console.error('messages: Failed to send message');
		}
	});
};



// document ready functions/events
$(document).ready(function(){
	var application = new App();
	application.retrieve();

	// refresh on click
	$('#refresh').on('click',function(){
		application.retrieve();
  });

	// send message on click on send
  $('#sendMsg').on('click',function(){
		var msg = {
			'username': application.user,
			'text': $('#textMsg').val(),
			'roomname': $('#selectRoom').val()
		};
    application.send(msg);
  });

  // filter friends only on click
  $('#friendsFilter').on('click',function(){
		$.each($('p'), function(){
			var friend = $(this).find('a').html();
			if (!application.friends[friend]) {
				$(this).hide();
			}
		});
  });

  //show all messages
  $('#allMessages').on('click', function(){
		$('p').show();
  });

  //make friends bold
  $('body').on('click', 'a', function(e){
		e.preventDefault();
		application.storeFriends($(this).html());
		application.checkFriends();

  });

  // change rooms on selection
	$('#rooms').on('change', function(){
		var roomName = $(this).val();
		roomName === 'All Rooms' ? $('p').show() : application.filterRoom(roomName);
	});
});




