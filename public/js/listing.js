document.getElementById('generate-link-btn').addEventListener('click', function() {
    var visibility = document.getElementById('visibility-toggle').value;
    var url;
    if (visibility === 'public') {
        url = '/public-listing';
    } else {
        url = '/private-listing';
    }
    var generatedLink = window.location.origin + url;

    var alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-primary';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = "Generated Link: <a href='" + generatedLink + "' class='alert-link'>" + generatedLink + "</a>. Give it a click if you like.";

    document.body.insertBefore(alertDiv, document.querySelector('.heading'));
});