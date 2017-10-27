// Green Dollar Sign
var CURRENCY_SYMBOL = "\uD83D\uDCB2";

// icon
var iconUp = function (data) {
  return '<i data-balloon="' + data +
    '" data-balloon-pos="up"><img class="real-cost-icon" src="' +
    chrome.extension.getURL('icon2.png') + '" /></i>';
};

// Main
var apply = function () {
  // Sync Info
  chrome.storage.sync.get("price", function (price) {
    chrome.storage.sync.get("type", function (type) {
      chrome.storage.sync.get("item_name", function (name) {
        changePrice(price.price, type.type, name.item_name);
      });
    });
  });
};

// Find and Change
var changePrice = function (price, type, name) {
  // Catalogue
  $(".sx-price, .a-price").not("[real-price-applied='true']")
    .each(function (i, obj) {
      var prices = $(obj).find(".sx-price-whole, .a-price-whole");
      $(obj)
        .find(".sx-price-fractional, .a-price-fraction")
        .each(function (id, frac) {
          prices[id] =
            parseFloat($(prices[id]).text() + "." + $(frac).text());
        });

      for (var a = 0; a < prices.length; ++a) {
        prices[a] = Math.trunc(prices[a] / parseFloat(price) * 100) / 100;
      }

      $(obj).find(".sx-price-whole, .a-price-whole")
        .each(function (id, whole) {
          $(whole).text(Math.trunc(prices[id]));
        });

      $(obj).find(".sx-price-fractional, .a-price-fraction")
        .each(function (id, frac) {
          varResult = Math.trunc((prices[id] % 1) * 100);
          if (varResult.toString().length === 2) {
            $(frac).text(varResult);
          } else {
            $(frac).text("0" + varResult);
          }
        });

      // redundancy check  
      $(obj).attr('real-price-applied', 'true');
    });

  $(".sx-price-currency, .a-price-symbol").text(CURRENCY_SYMBOL);

  // Amazon Internal Selector
  var applicants = ".a-color-base, .a-color-price, .a-text-strike, .a-size-minim .p13n-sc-price, .a-color-secondary";


  // dollar finder
  var currency = new RegExp(/\$\d{1,3}(\,\d{3})*(\.\d{2})?/);

  // Apply Interal
  $(applicants).not("[real-price-applied='true']")
    .each(function (i, obj) {
      var text = $(obj).html();
      var matchedany = false;

      while (match = currency.exec(text)) {
        text = text.replace(
          match[0],
          CURRENCY_SYMBOL + match[0].substring(1) +
          iconUp(parseFloat(
            Math.trunc((match[0].substring(1)) / parseFloat(price) * 100) / 100) + ' ' + name));
        matchedany = true;
      }

      $(obj).attr('real-price-applied', 'true');

      if (matchedany) {
        $(obj).html(text);
      }
    });
};

// start
$(document).ready(apply);

var hasScrolled = false;

$(window).scroll(function () {
  hasScrolled = true;
});

setInterval(function () {
  if (hasScrolled) {
    apply();
    hasScrolled = false;
  }
}, 1500);

$(".a-button").click(function () {
  setTimeout(apply, 300);
});