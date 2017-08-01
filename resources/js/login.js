/** TODO
 * enforce https via forward
 * 
 * on error show error message
 * on login forward to actual page, with session id
 * 
 */ 

$(document).ready(function()
{
	$('#notification')
	.hide();
	
	$('#confirm').click
	(
		function()
		{
			$.post
			(
				'resources/cgi-bin/server.pl', // connection to perl works only if same server ('same origin')
				{
					'request':	'login',
					'user':		$('#userNameInput').val(),
					'password': $('#passwordInput').val()
				}
			)
			.done
			(
				function(response)
				{
					if (response == 0 || response == null)
					{
						$('#notification')
						.text('Invalid user and / or password.')
						.show();
					}
					else
					{
						Spider.session_id = response;
						Spider.user = $('#userNameInput').val();
						$('#login').css('visibility', 'hidden');
						$('#login').css('height', '0');
						$('#login').css('padding', '0');
						$('#login').css('border', 'none');
						$('#editing-panes').css('visibility', 'visible');
						toggleNav(); //Show side menu
						$('.pane-button').prop('checked', true); //Set each pane to visible
						togglePane(); //Refresh panes so they appear
						login();
						initEditor();
						//window.location = 'index.html?session=' + response + '&user=' + $('#userNameInput').val();
					}
				}
			)
			.fail
			(
				function(response)
				{
					$('#notification')
					.text('Could not connect to server.')
					.show();
					
					console.log(response);
				}
			);
		}
	);
});