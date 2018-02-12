window.onload = () => {
  const body = document.querySelector('body')

  function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
  }

  class Base {
    constructor () {
      this.x = 0
      this.y = 0
      this.elem = null
    }

    pos (x, y) {
      if (!this.elem) return
      this.x = x
      this.y = y
      this.elem.style.left = `${this.x}` + 'px'
      this.elem.style.top = `${this.y}` + 'px'
    }

    moveX (x) {
      this.x += x
      this.pos(this.x, this.y)
    }

    moveY (y) {
      this.y += y
      this.pos(this.x, this.y)
    }
    
    remove() {
      this.elem.parentNode.removeChild(this.elem)
    }

    show () {
      this.visible = true
      this.elem.style.display = ''
    }

    hide () {
      this.visible = false
      this.elem.style.display = 'none'
    }
  }

  class Rect extends Base {
    constructor (w, h, body) {
      super()
      this.elem = document.createElement('div')
      this.elem.className = 'rect'
      this.elem.style.position = 'absolute'
      this.w = w
      this.h = h
      this.elem.style.width = w + 'px'
      this.elem.style.height = h + 'px'
      body.appendChild(this.elem)
    }

    static hit(rect1, rect2) {
      const mx1 = rect1.x
      const my1 = rect1.y
      const mx2 = rect1.x + rect1.w
      const my2 = rect1.y + rect1.h
      const ex1 = rect2.x
      const ey1 = rect2.y
      const ex2 = rect2.x + rect2.w
      const ey2 = rect2.y + rect2.h
      if ( (mx1 <= ex2 && ex1 <= mx2 && my1 <= ey2 && ey1 <= my2)) {
        return true
      }
      return false
    }

  }

  class Maid extends Base {
    constructor (body) {
      super()
      this.elem = document.createElement('img')
      this.elem.className = 'maid'
      this.elem.src = './maid.png'
      this.elem.style.position = 'absolute'
      body.appendChild(this.elem)
      this.rect = new Rect(50, 120, body)
      this.rect.hide()
      this.comment = new Comment('おらよ', body)
      this.comment.hide()
    }

    pos (x, y) {
      super.pos(x, y)
      this.rect.pos(x + 30, y)
      this.comment.pos(x + 40, y - 40)
    }

    text (text) {
      this.comment.text(text)
    }

    talk (t) {
      this.comment.talk(t)
    }
  }

  class Children extends Base {
    constructor (body) {
      super()
      this.elem = document.createElement('img')
      this.elem.className = 'children'
      this.elem.src = './children.png'
      this.elem.style.position = 'absolute'
      body.appendChild(this.elem)
      this.rect = new Rect(150, 100, body)
      this.rect.hide()
      this.comment = new Comment('菓子くれ', body)
      this.comment.hide()
    }

    pos (x, y) {
      super.pos(x, y)
      this.rect.pos(x, y)
      this.comment.pos(x + 40, y - 40)
    }
    
    text (text) {
      this.comment.text(text)
    }

    talk (t) {
      this.comment.talk(t)
    }

  }

  class Choco extends Base {
    constructor (body) {
      super()
      this.elem = document.createElement('img')
      this.elem.className = 'choco'
      this.elem.src = './choco.png'
      this.elem.style.position = 'absolute'
      body.appendChild(this.elem)
      this.rect = new Rect(50, 50, body)
      this.rect.hide()
    }

    pos (x, y) {
      super.pos(x, y)
      this.rect.pos(x, y)
    }

    remove() {
      super.remove()
      this.rect.remove()
    }
  }

  class Gomi extends Base {
    constructor (body) {
      super()
      this.elem = document.createElement('img')
      this.elem.className = 'gomi'
      this.elem.src = './gomi.png'
      this.elem.style.position = 'absolute'
      body.appendChild(this.elem)
      this.rect = new Rect(50, 50, body)
      this.rect.hide()
    }

    pos (x, y) {
      super.pos(x, y)
      this.rect.pos(x, y)
    }

    remove() {
      super.remove()
      this.rect.remove()
    }
  }

  class Comment extends Base {
    constructor (text, body) {
      super()
      this.message = document.createElement('div')
      this.message.innerHTML = text
      this.elem = document.createElement('div')
      this.elem.className = 'comment'
      this.elem.appendChild(this.message)
      this.elem.style.position = 'absolute'
      body.appendChild(this.elem)
    }

    text (text) {
      this.message.innerHTML = text
    }

    talk (t = 1000) {
      if (!this.visible) {
        this.show()
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, t)
      }
    }
  }

  const top = 0
  const left = 0
  const right = 520
  const bottom = 500
  const stage = new Rect(right - left, bottom - top, body)

  const children = new Children(body)
  children.pos(200, 50)
  const maid = new Maid(body)
  maid.pos(225, children.y + 300)

  let i = 0
  let chocos = {}
  let gomis = {}
  let childrenMoveX = null
  let sendCount = 0
  let receiveCount = 0
  let countDown = 60

  const send = document.createElement('div')
  send.style.position = 'absolute'
  send.style.left = right + 20 + 'px'
  send.style.top = '30px'
  send.style.display = 'flex'
  const iconChoco = document.createElement('img')
  iconChoco.src = './choco.png'
  iconChoco.style.width = '30px'
  iconChoco.style.height = '30px'
  const iconChocoText = document.createElement('div')
  iconChocoText.innerHTML = '×0'
  send.appendChild(iconChoco)
  send.appendChild(iconChocoText)
  body.appendChild(send)
  const receive = document.createElement('div')
  receive.style.position = 'absolute'
  receive.style.left = right + 20 + 'px'
  receive.style.top = '80px'
  receive.style.display = 'flex'
  const iconGomi = document.createElement('img')
  iconGomi.src = './gomi.png'
  iconGomi.style.width = '30px'
  iconGomi.style.height = '30px'
  const iconGomiText = document.createElement('div')
  iconGomiText.innerHTML = '×0'
  receive.appendChild(iconGomi)
  receive.appendChild(iconGomiText)
  body.appendChild(receive)
  const timeText = document.createElement('div')
  timeText.style.position = 'absolute'
  timeText.style.left = right + 20 + 'px'
  timeText.style.top = '130px'
  timeText.innerHTML = `残り時間：${countDown}秒`
  body.appendChild(timeText)


  const commandText = document.createElement('div')
  commandText.innerHTML = 'キー操作：←→キーで移動、spaceキーでチョコぶん投げる'
  commandText.style.position = 'absolute'
  commandText.style.top = bottom +  20 + 'px'
  body.appendChild(commandText)

  // command
  let shot = false
  let moveX = null
  let pressedL = false
  let pressedR = false

  body.onkeyup = (e) => {
    const keycode = e.keyCode
    // Space
    if (keycode == 32) {
      shot = true
    }
    // ←
    if (keycode == 37) {
      pressedL = false
    }
    // →
    if (keycode == 39) {
      pressedR = false
    }
    if (!pressedL && !pressedR) {
      moveX = null
    }
  }

  body.onkeydown = (e) => {
    const keycode = e.keyCode
    // ←
    if (keycode == 37) {
      pressedL = true
      moveX = 'lx'
    }
    // →
    if (keycode == 39) {
      pressedR = true
      moveX = 'rx'
    }
  }


  // game loop
  function loop () {

    // AI
    if (i % 30 === 0) {
      // 意思決定
      childrenMoveX = ( getRandomInt(1, 10) % 2 === 0 ? 'rx' : 'lx')
      // たまにコメント
      if (getRandomInt(1, 10) % 2 === 0) {
        children.text('菓子くれ')
        children.talk()
      }
    }

    if (i % 60 === 0) {
      countDown--
      timeText.innerHTML = `残り時間：${countDown}秒`
    }
    if (countDown === 0) {
      const endText = document.createElement('div')
      endText.style.position = 'absolute'
      endText.style.left = right/4 + 'px'
      endText.style.top = bottom/3 + 'px'
      endText.style.fontSize = '4rem'
      endText.style.color = 'red'
      endText.style.textShadow = '0.1rem 0.1rem 0.1rem rgba(0,0,0,1)'
      endText.innerHTML = `Time Up!`
      maid.text('ぐぬぬ')
      children.text('ケケケ')
      if (receiveCount > 80) {
        maid.text('ゴミィ')
        children.text('どやぁ')
      }
      if (sendCount > 100) {
        maid.text('ざまぁ')
        children.text('ぎゃーす')
      }
      maid.talk(3000)
      children.talk(3000)
      body.appendChild(endText)
      return
    } 

    // 的移動
    switch (childrenMoveX) {
      case 'rx':
        if (children.x < right - 140) {
          children.moveX(10)
        }
        break
      case 'lx':
        if (children.x > left + 10) {
          children.moveX(-10)
        }
        break
    }

    // プレイヤー移動
    switch (moveX) {
      case 'rx':
        if (maid.x < right - 80) {
          maid.moveX(10)
        }
        break
      case 'lx':
        if (maid.x > left) {
          maid.moveX(-10)
        }
        break
    }

    // チョコ生成
    if (shot) {
      maid.text('おらよ')
      maid.talk()
      shot = false
      const choco = new Choco(body)
      choco.pos(maid.x + 30, maid.y - 30)
      chocos[i] = choco
    }

    for (let key in chocos) {
      const choco = chocos[key]
      choco.moveY(-3)

      // 当たり判定
      if (Rect.hit(choco.rect, children.rect)) {
        //console.log('hit')
        sendCount++
        iconChocoText.innerHTML = '×' + sendCount
        choco.remove()
        delete chocos[key]

        if (!gomis[i]) {
          children.text('わーい')
          children.talk()

          // ゴミで反撃
          const gomi = new Gomi(body)
          gomi.pos(children.x + 50, children.y + 80)
          gomis[i] = gomi
        }
        continue
      }

      // 一定時間後消滅
      if (key < (i - 90)) {
        choco.remove()
        delete chocos[key]
      }
    }

    for (const key in gomis) {
      const gomi = gomis[key]
      gomi.moveY(3)

      // 当たり判定
      if (Rect.hit(gomi.rect, maid.rect)) {
        receiveCount++
        iconGomiText.innerHTML = '×' + receiveCount
        maid.text('コノヤロ')
        maid.talk()
        
        gomi.remove()
        delete gomis[key]
        continue
      }

      // 一定時間後消滅
      if (key < (i - 120)) {
        gomi.remove()
        delete gomis[key]
      }
    }


    i++
    requestAnimationFrame(loop)
  }
  loop()
}

