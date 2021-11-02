const formToJSON = (elements) => {
  const newAttributes = [];
  const attributes = document.getElementsByName("attributes");
  attributes.forEach((attribute) => {
    if (attribute.checked) {
      attributeArray = attribute.id.split("-");
      newAttributes.push([
        attributeArray[1],
        attributeArray[2],
        attributeArray[3],
      ]);
    }
  });
  const dataReduced = [].reduce.call(
    elements,
    (data, element) => {
      if (element.name !== "attributes" && element.name !== "") {
        data[element.name] = element.value;
      }
      data["attributes"] = { ...newAttributes };
      return data;
    },
    {}
  );
  return dataReduced;
};

ddocument
  .getElementById("md365-subscribe-form")
  .addEventListener("submit", submitForm(evt));

function submitForm(evt) {
  evt.preventDefault();
  const form = document.getElementsByClassName("md365-form")[0];
  const data = formToJSON(form.elements);
  var request = new XMLHttpRequest();

  request.open(
    "POST",
    "http://localhost:5000/public/api/signup/867f00d2-be58-4597-a512-12b7f4020d12"
  );
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
  request.addEventListener("load", function (event) {
    if (request.status >= 200 && request.status < 300) {
      if (document.getElementById("success-message") != null) {
        document.getElementById("success-message").classList.remove("hidden");
      } else {
        var el = document.getElementById("failure-message");
        el.innerHTML = `  <span class="md365-h3" id="success-message"><h3>${formatMessage(
          messages.successfulSubmit
        )}</h3></span>`;
      }
    } else if (
      request.status == 400 ||
      request.status == 500 ||
      request.status == 409
    ) {
      if (document.getElementById("success-message") != null) {
        var el = document.getElementById("success-message");
        var newEl = document.createElement("p");
        var response = JSON.parse(request.responseText);
        newEl.innerHTML = ` <span class="md365-h3" id="failure-message"><h3>${response.error}</h3></span>`;
        el.parentNode.replaceChild(newEl, el);
      } else {
        var response = JSON.parse(request.responseText);
        var el = document.getElementById("failure-message");
        el.innerHTML = ` <span class="md365-h3" id="failure-message"><h3>${response.error}</h3></span>`;
      }
    } else {
      var response = JSON.parse(request.responseText);
      alert(response.error);
    }
  });
  request.addEventListener("error", function (event) {
    var response = JSON.parse(request.responseText);
    alert(response.error);
  });
}
