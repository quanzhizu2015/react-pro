// TODO: rediect through server
function browserRedirect(){
  var i=navigator.userAgent.toLowerCase(),o="ipad"==i.match(/ipad/i),a="iphone os"==i.match(/iphone os/i),e="midp"==i.match(/midp/i),c="rv:1.2.3.4"==i.match(/rv:1.2.3.4/i),w="ucweb"==i.match(/ucweb/i),d="android"==i.match(/android/i),r="windows ce"==i.match(/windows ce/i),t="windows mobile"==i.match(/windows mobile/i);(o||a||e||c||w||d||r||t)&&(window.location.href="/wapa")
}

// browserRedirect()

function asyncScriptLoader(url, options, global = window, doc = document, srt = 'script') {
  const script = doc.createElement(srt)
  script.async = true
  script.src = url;
  script.onerror = err => {
    if(err) {
      if(window.localStorage) {
        localStorage.setItem('statAvaiable', 'N')
      }
    }
  }
  script.onload = (evt) => {
    console.error(evt)
  }
  
  if(!!options) {
    for(let option in options) {
      if(options.hasOwnProperty(option)){
        script[option] = options[option]
      }
    }
  }
  const headPlaceholder= doc.getElementsByTagName(srt)[0];
  headPlaceholder.parentNode.insertBefore(script, headPlaceholder)
}

if(window.localStorage /*&& localStorage.getItem('statAvaiable') !== 'N'*/) {
  const googleTagManagerUrl = 'https://www.googletagmanager.com/gtag/js?id=UA-46462382-3', googleTagManagerOptions = {
    integrity: 'sha384-5dGPsvmks3akLNGzJezq+FjzxXD0V50jweHVUm6h7+65iVdq9t4WbRtnlYG8qUt7',
    crossOrigin: "anonymous",
  }
  asyncScriptLoader(googleTagManagerUrl, googleTagManagerOptions)
  const dataLayer = window.dataLayer || []
  function gtag(){
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'UA-46462382-3')

  const twqUrl = '//static.ads-twitter.com/uwt.js'
  asyncScriptLoader(twqUrl)
  function twq(){
    twq.exe
    ? twq.exe.apply(twq,arguments)
    : twq.queue.push(arguments);
  }
  twq.queue = []
  twq('init','o06nb')
  twq('track','PageView')
}