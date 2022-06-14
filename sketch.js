function setup() {
  createCanvas(windowWidth, windowHeight)
  // createCanvas(2550, 1150)

  shapes = []
  mods = [pt, am, fm, fm2, fm3, ss, ss2, as, as2, as3, as4]
  // mods = [pt, am]
  // mods = [as2, as3, as4]
  waves = []
  total = 1<<3
  fps = 0

  s = 8
  p = 3
  dt = 0.5

  l = TWO_PI * p
  w = l * s
  h = s * 8
  
  hl = l * 0.5
  hw = w * 0.5
  hh = h * 0.5
  
  render(0)
  
  let amount = total
  while(amount--) {
    waves.push(new Wave())
  }
  
  textSize(32)
  imageMode(CENTER)
}

function hasLeftScreen(wave) {
  let pointA = p5.Vector.sub(wave.pos, p5.Vector.mult(wave.orientation, hw))
  let pointB = p5.Vector.add(wave.pos, p5.Vector.mult(wave.orientation, hw))
  if (screenContains(pointA) || screenContains(pointB))
    return false
  return true
}

function screenContains(vec) {
  if (vec.x < width && vec.x > 0 && vec.y > 0 && vec.y < height) 
    return true
  return false
}

function draw() {
  background(10)
  noFill()
    
  let a = frameCount * 0.5
  cleanUp()
  render(a)
  
  let remove = []
  for (const w of waves) {
    w.draw()
    w.advance()
    if (w.entered) {
      if (hasLeftScreen(w)) {
        remove.push(waves.indexOf(w))
      }      
    } else {
      if (!hasLeftScreen(w)) {
        w.entered = true
      }
    }
  }
  
  for (let i = remove.length - 1; i >= 0; i--) {
    waves.splice(remove[i], 1)
  }
  
  let i = total - waves.length
  while(i-- > 0) {
    waves.push(new Wave())
  }
  
  if (frameCount % 15 == 0) {
    fps = frameRate()
    if (fps > 59) {
      total += 2
    } else if (total > 12 && fps < 58) {
      total -= 2
    }
  }
  
  fill(225)
  stroke(10)
  text(nf(fps, 3, 1), 20, 30)
  text(total, 20, 60)
  text(waves.length, 20, 90)
  text(`${windowWidth} x ${windowHeight}`, 20, 120)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

class Wave {

  constructor() {
    this.shape = floor(random(0, shapes.length))
    this.entered = false
    this.speed = random(3, 6)
    this.orientation = createVector(random(-1, 1), random(-1, 1)).normalize()
    
    if (this.orientation.y < 0) {
      this.pos = createVector(random(0, width), height)
    } else {
      this.pos = createVector(random(0, width), 0)
    }
    this.pos.sub(p5.Vector.mult(this.orientation, hw))
  }
  
  advance() {
    this.pos.add(p5.Vector.mult(this.orientation, this.speed))
  }
  
  draw() {
    push()
    translate(this.pos.x, this.pos.y)
    // stroke(255, 0, 0)
    // strokeWeight(2)
    // point(-this.orientation.x * hw, -this.orientation.y * hw)
    // point(this.orientation.x * hw, this.orientation.y * hw)
    // line(0, 0, this.orientation.x * hw, this.orientation.y * hw)
    rotate(this.orientation.heading())
    image(shapes[this.shape], 0, 0)
    pop()
  }
  
}

function cleanUp() {
  for (const g of shapes) {
    g.remove()
  }
  shapes = []
}

function render(a) {
  for (const mod of mods) {
    const g = createGraphics(w, h)
    g.background(10, 0)
    g.noFill()
    g.stroke(225, 125)
    g.strokeWeight(3)
    g.translate(hw, hh)

    g.beginShape()
    for (let t = -hl; t < hl; t += dt) {
      mod(g, t, a)
    }
    g.endShape()
    shapes.push(g)
  }
}

function pt(g, t, a) {
  g.vertex(t * s, sin(t + a) * s)
}

function am(g, t, a) {
  let m = map(t, -hl, hl, 0, h)
  if (t > 0) {
    m = h - m
  }
  g.vertex(t * s, sin(t + a) * m)
}

function fm(g, t, a) {
  let m = map(t, -hl, 0, 1, 0.5)
  if (t > 0) {
    m = map(t, 0, hl, 0.5, 1)
  }
  g.vertex(t * m * s, sin(t + a) * s)
}

function fm2(g, t, a) {
  g.vertex((t + sin(t * 0.5)) * s, sin(t + a) * s)
}

function fm3(g, t, a) {
  g.vertex((t - sin(t * 0.5)) * s, sin(t + a) * s)
}

function ss(g, t, a) {
  g.vertex((t - abs(t * 0.25)) * s, sin(t + a) * s)
}

function ss2(g, t, a) {
  g.vertex(t * s, sin(t - abs(t * 0.25) + a) * s)
}

function as(g, t, a) {
  g.vertex((t + sin(t)) * s, sin(t + a) * s)
}

function as2(g, t, a) {
  g.vertex(t * s, (sin(t + a) + sin(2*t + a)) * s)
}

function as3(g, t, a) {
  g.vertex(t * s, (sin(t + a) + sin(3*t + a)) * s)
}

function as4(g, t, a) {
  g.vertex(t * s, (sin(t + a) + sin(4*t + a)) * s)
}