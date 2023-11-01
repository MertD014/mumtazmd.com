// Wait for the DOM to be fully loaded (This is necessary)
document.addEventListener("DOMContentLoaded", function () {
  // request IP address
  $.getJSON("https://api.ipify.org?format=jsonp&callback=?", function (data) {
    var ipAddress = data.ip;

    // Update text
    var welcomeIpElement = document.querySelector(".welcome-ip");
    if (welcomeIpElement) {
      welcomeIpElement.textContent = "Welcome " + ipAddress + "!";
    }
  });
});
