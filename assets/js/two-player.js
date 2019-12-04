class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	copy() {
		return new Vector(this.x, this.y);
	}

	mul_k(k) {
		this.x *= k;
		this.y *= k;
		return this;
	}

	mul_new(k) {
		return new Vector(this.x * k, this.y * k);
	}

	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	add_new(vec) {
		return new Vector(this.x + vec.x, this.y + vec.y);
	}

	sub(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this
	}

	sub_new(vec) {
		return new Vector(this.x - vec.x, this.y - vec.y);
	}

	rotate(angle) {
		var x = this.x, y = this.y;
		this.x = x * Math.cos(angle) - Math.sin(angle) * y;
		this.y = x * Math.sin(angle) + Math.cos(angle) * y;
		return this;
	}

	angle() {
		return Math.atan2(this.y, this.x);
	}

	len() {
		var l = Math.sqrt(this.x * this.x + this.y * this.y);
		if (l < 0.005 && l > -0.005)
			return 0;
		return l;
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}

	setlength(length) {
		var l = this.len();
		if (l)
			this.mul_k(length / l);
		else
			this.x = this.y = length;
			return this;
	}

	setlength_new(length) {
		return this.copy().setlength(length);
	}

	dist(vec) {
		return Math.sqrt((this.x - vec.x) ** 2 + (this.y - vec.y) ** 2);
	}

	normalize() {
		var l = this.len();
		this.x /= l;
		this.y /= l;
		return this;
	}
}

function code(name) {
	var dict = {'up': 38, 'down': 40, 'left': 37, 'right': 39, 'esc': 27};
	if (dict[name])
		return dict[name];
	return name.charCodeAt(0);
}

function radians(deg) {
	return deg * 0.0174532925;
}

function degrees(rad) {
	return rad * 57.2957795;
}

function drawLine(ctx, x0, y0, x1, y1) {
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.lineTo(x1 + 5, y1 + 5);
	ctx.closePath();
	ctx.fill();
}

function drawCurve(ctx, x0, y0, x1, y1) {
	var dx = 3;
	var dy = -(x1 - x0) / (y1 - y0);
	if (dy > 3 || dy < -3) {
		dx = 3 / dy;
		dy = 3;
	}
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.bezierCurveTo(x0 + dx, y0 + dy, x1 + dx, y1 + dy, x1, y1);
	ctx.bezierCurveTo(x1 - dx, y1 - dy, x0 - dx, y0 - dy, x0, y0);
	ctx.closePath();
}

function tracePoly(ctx, verts) {
	ctx.beginPath();
	ctx.moveTo(verts[0][0], verts[0][1]);
	for (var i = 1; i < verts.length; i++)
		ctx.lineTo(verts[i][0], verts[i][1]);
	ctx.closePath();
}

function random(from, range) {
	return Math.floor(Math.random() * (range + 1) + from);
}

function randomColor() {
	return (['white', 'grey'])[random(0, 1)];
}

var w = document.documentElement.clientWidth, h = document.documentElement.clientHeight;
// =======================================================================================================================================================================================
// =======================================================================================================================================================================================


class Space {
	constructor(name, players, objects) {
		this.name = name;
		this.keysPressed = {};
		this.players = players;
		this.objects = objects;
		this.bubbles = [];
		this.buffs = [];
		this.lasers = [];
		this.particles = [];
	}

	createFrame() {
		this.gameContainer=document.createElement('div');
		this.gameContainer.className='ASTEROIDSYEAH';

		document.body.appendChild(this.gameContainer);

		this.canvas=document.createElement('canvas');
		this.canvas.setAttribute('width',w);
		this.canvas.setAttribute('height',h);
		this.canvas.className='ASTEROIDSYEAH';
		this.canvas.style.position = "fixed";

		this.gameContainer.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		this.fillStyle = "black";
		this.ctx.strokeStyle = "black";
	}

	clear() {
		this.ctx.clearRect(0, 0, w, h);
	}

	update() {
		var now_time = new Date().getTime();
		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].control(control[this.players[i].id]);
			this.players[i].update();
		}

		if (this.bubbles.length <= 3 && now_time - bubble_update > 3000) {
			var next = Math.random();
			if (next < 0.3)
				this.bubbles.push(new LaserBubble(new Vector(Math.random() * w, Math.random() * h)));
			else if (next < 0.6)
				this.bubbles.push(new AsteroidBubble(new Vector(Math.random() * w, Math.random() * h)));
			else if (next < 0.9)
				this.bubbles.push(new SpreadBubble(new Vector(Math.random() * w, Math.random() * h)));
			bubble_update = new Date().getTime();
		}

		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		for (var i = 0; i < this.bubbles.length; i++) {
			var bubble = this.bubbles[i];
			for (var j = 0; j < this.players.length; j++) {
				if (bubble.target(this.players[j])) {
					bubble.buff(this.players[j], this.objects, this.buffs, this.lasers);
					this.bubbles.splice(i, 1);
					bubble_update = now_time;
				}
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			for (var j = 0; j < this.players.length; j++) {
				var object = this.objects[i];
				if (object.target(this.players[j].pos)) {
					this.players[j].explode(this.particles);
					this.players.splice(j, 1);
				}
			}
		}

		for (var i = 0; i < this.buffs.length; i++) {
			var buff = this.buffs[i];
			if (now_time - buff.init > buff.duration) {
				this.buffs.splice(i, 1);
				i--;
				continue;
			}
			if (now_time - buff.last_update > buff.load) {
				this.buffs[i].execute(this.lasers);
			}
		}
		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		this.clear();
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].drawShip(this.ctx);
		}

		for (var i = 0; i < this.bubbles.length; i++) {
			this.bubbles[i].draw(this.ctx);
		}

		for (var i = 0; i < this.lasers.length; i ++) {
			this.lasers[i].draw(this.ctx);
			if (this.lasers[i].check()) {
				this.lasers.splice(i, 1);
				break;
			}
			for (var j = 0; j < this.players.length; j++) {
				var player = this.players[j];
				this.lasers[i].move();
				if (this.lasers[i].id != player.id && this.lasers[i].target(player.pos)) {
					player.explode(this.particles);
					this.players.splice(j, 1);
					this.lasers.splice(i, 1);
					break;
				}
			}
		}

		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].pos.add(this.particles[i].dir.mul_new(this.particles[i].vel));
			if (this.particles[i].check() || this.particles[i].alpha < 0.4) {
				this.particles.splice(i, 1);
			}
			else {
				this.particles[i].draw(this.ctx);
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].move();
			this.objects[i].check();
			this.objects[i].draw(this.ctx);
		}

		last_update = now_time;
		var that = this
		setTimeout(function() {that.update()}, 14);
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

class Object {
	constructor(pos, health) {
		this.pos = pos;
		this.health = health;
		this.can_shoot = false;
	}

	check() {
		if (this.pos.x > w) {
			this.pos.x = 0;
		}
		else if (this.pos.x < 0) {
			this.pos.x = w;
		}
		if (this.pos.y > h) {
			this.pos.y = 0;
		}
		else if (this.pos.y < 0) {
			this.pos.y = h;
		}
	}
}

class Playership extends Object {
	constructor(pos, dir, id, color) {
		super(pos, 100);
		this.id = id;
		this.verts = [[-15, -10], [-7.5, 0], [-15, 10], [15, 0]];
		this.dir = dir;
		this.vel = new Vector(0, 0);
		this.color = color;
		this.in_control = true;
		this.max_speed = 25;
		this.rot_speed = 200;
		this.bullet_speed = 300;
		this.load = 100;
		this.firedAt = false;
		this.lasers = [];
	}

	control(keys) {
		if (keysPressed[keys[0]]) {
			this.vel.add(this.dir.mul_new(0.5));
		}
		else {
			this.vel.mul_k(0.99);
		}

		if (keysPressed[keys[1]]) {
			this.dir.rotate(radians(this.rot_speed * 0.03*-1));
		}

		if (keysPressed[keys[2]]) {
			this.dir.rotate(radians(this.rot_speed*0.03));
		}
	}

	update() {
		if (this.vel.len() > this.max_speed) {
			this.vel.setlength(this.max_speed);
		}

		this.pos.add(this.vel.mul_new(0.3));
		this.check();
	}

	drawShip(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.lineWidth = 3;
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 3;
		// ctx.shadowOffsetX = 3;
		// ctx.shadowOffsetY = 3;
		tracePoly(ctx, this.verts);
		// this.ctx.fillStyle = "white";
		// this.ctx.fill();
		// this.tracePoly(ship.verts);
		ctx.strokeStyle = 'white';
		ctx.stroke();
		ctx.restore();
	}

	drawLaser(ctx) {
		for (var i = 0; i < this.lasers.length; i++) {
			this.lasers[i].draw(ctx);
		}
	}

	checkLive(objects) {
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].target(this.pos)) {
				this.health -= 0.2;
			}
		}
		if (this.health > 0)
			return true;
		return false;
	}

	drawHealth (ctx) {
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.shadowColor = "#ff0000";
		ctx.shadowBlur = 5;
		ctx.lineWidth = 10;
		ctx.moveTo(50, 40);
		ctx.lineTo(this.health * 1.5 + 50, 40);
		ctx.stroke();
		ctx.closePath();
	}

	shoot(lasers) {
		lasers.push(new Laser());
	}

	explode(particles) {
		this.in_control = false;
		for (var k = 0; k < 50; k++) {
			particles.push(new Particle((new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(), this.pos.copy(), 10));
		}
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

class Bubble {
	constructor(pos) {
		this.pos = pos;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.shadowColor = "white";
		ctx.lineWidth = 2;
		ctx.arc(this.pos.x, this.pos.y, 15, 0, 2*Math.PI);
		ctx.stroke();
		ctx.closePath();
	}

	target(player) {
		return player.pos.dist(this.pos) < 20;
	}
}

class AsteroidBubble extends Bubble {
	buff(player, objects) {
		var shoot_dir = player.vel.copy();
		objects.push(new SmallAsteroid(this.pos.add_new(shoot_dir.mul_new(3)), new Vector(1, 1), shoot_dir, 1));
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.shadowColor = "white";
		ctx.lineWidth = 2;
		ctx.arc(this.pos.x, this.pos.y, 15, 0, 2*Math.PI);
		ctx.stroke();
		ctx.closePath();
		ctx.save();
		ctx.strokeStyle = "white";
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(0.5);
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(0, 0);
		ctx.lineTo(10, 0);
		ctx.lineTo(10, 10);
		ctx.lineTo(0, 0);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
}

class LaserBubble extends Bubble {
	buff(player, objs ,buffs) {
		buffs.push(new LaserBuff(player));
	}

	draw(ctx) {
		ctx.strokeStyle = "white";
		ctx.shadowColor = "white";
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.arc(this.pos.x, this.pos.y, 15, 0, 2*Math.PI);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.shadowColor = "green";
		ctx.shadowBlur = 30;
		drawCurve(ctx, this.pos.x - 5, this.pos.y - 5, this.pos.x + 5, this.pos.y + 5);
		ctx.fill();
		ctx.closePath();
	}
}

class SpreadBubble extends Bubble {
	buff(player, _, a, lasers) {
		for (var k = 0; k < 10; k++) {
			lasers.push(new Laser(new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10).normalize(), this.pos.copy(), 3, "#0000ff", player.id));
		}
	}
}

class LaserBuff {
	constructor(player) {
		this.player = player;
		this.init = new Date().getTime();
		this.duration = 5000;
		this.last_update = 0
		this.load = 500;
	}

	execute(lasers) {
		this.last_update = new Date().getTime();
		lasers.push(new Laser(this.player.dir.copy(), this.player.pos.copy(), 10, "#00ff00", this.player.id));
	//  lasers.push(new Laser(new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10).normalize(), this.player.pos.copy(), 3, "#0000ff", this.player.id));
	}
}

class Asteroid extends Object{
	constructor(pos, dir, vel, health) {
		super(pos, health);
		this.dir = dir;
		this.vel = vel;;
		this.rot_speed = 50;
		this.radius = 40;
		this.verts = [[0, 40], [-29, 27.6], [-39.6, 5.86], [-36.8, -15.7], [-5.85, -39.6], [29.6, -26.9], [31, -13.8], [39, 9], [21.6, 24.2], [20.6, 34]];
		this.max_particles = 30;
		this.particles = [];
	}

	move() {
		this.pos.add(this.vel.mul_new(0.3));
		this.dir.rotate(radians(this.rot_speed * 0.03 *-1));
	}

	target(pos) {
		return this.pos.dist(pos) <= this.radius;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.lineWidth = 2;
		ctx.shadowColor = "#B700FF";
		ctx.shadowBlur = 3;
		tracePoly(ctx, this.verts);
		ctx.strokeStyle = "white";
		ctx.stroke();
		ctx.restore();
	}

	explode(objects) {
		for (var v = 0; v < 4; v++) {
			objects.push(new SmallAsteroid(this.pos.copy(), new Vector(1, -1), new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5), 1));
		}
		for (var k = 0; k < this.max_particles; k++) {
			var x = Math.random() * 20 - 10;
			this.particles.push(new Particle((new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(), this.pos.copy(), 10));
		}
		return this.particles;
	}

	check() {
		if (this.pos.x > w + this.radius) {
			this.pos.x = -this.radius;
		}
		else if (this.pos.x < -this.radius) {
			this.pos.x = w + this.radius;
		}
		if (this.pos.y > h + this.radius) {
			this.pos.y = -this.radius;
		}
		else if (this.pos.y < -this.radius) {
			this.pos.y = h + this.radius;
		}
	}
}

class SmallAsteroid extends Asteroid {
	constructor(pos, dir, vel, health) {
		super(pos, dir, vel, health);
		this.radius = 20;
		this.rot_speed = 100;
		this.max_particles = 10;
		this.verts = [[0, 20], [-14.5, 13.8], [-15.5, 5.7], [-20, 0], [-12.95, -15.25], [3.8, -19.6], [15.4, -8.5], [19.1, 6], [11.3, 14.25], [4.4, 14.5]];
	}

	explode() {
		for (var k = 0; k < this.max_particles; k++) {
			var x = Math.random() * 20 - 10;
			this.particles.push(new Particle((new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(), this.pos.copy(), 10));
		}
		return this.particles;
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================


class Ray {
	constructor(dir, pos, vel) {
		this.dir = dir;
		this.pos = pos;
		this.vel = vel;
	}

	check() {
		return this.pos.x < 0 || this.pos.x > w || this.pos.y < 0 || this.pos.y > h;
	}
}

class Laser extends Ray {
	constructor(dir, pos, vel, color, id) {
		super(dir, pos, vel);
		this.color = color
		this.id = id;
	}

	move() {
		this.pos.add(this.dir.mul_new(this.vel));
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 3;
		drawCurve(ctx, this.pos.x, this.pos.y, this.pos.x - this.dir.x*20, this.pos.y - this.dir.y*20);
		ctx.fill();
		ctx.closePath();
		ctx.shadowColor = null;
	}

	target(vec) {
		return this.pos.dist(vec) < 10;
	}
}

class RoundLaser extends Laser {
	constructor(dir, pos, vel, color, radius) {
		super(dir, pos, vel, color);
		this.radius = radius;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 40;
		ctx.fillStyle = "blue";
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.arc(this.pos.x, this.pos.y, this.radius - 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	target(vec) {
		return this.pos.dist(vec) < this.radius;
	}
}

class UpLaser extends RoundLaser {
	constructor(dir, pos, vel, color, radius) {
		super(dir, pos, vel, color, radius);
	}

	move() {
		this.pos.add(this.dir.mul_new(this.vel));
		this.vel += 0.1;
		if (this. radius < 40)
			this.radius += 0.2;
	}
}

class LineLaser extends Ray {
	constructor(dir, pos, vel) {
		super(dir, pos, vel);
	}

	move() {
		return;
	}

	draw(player) {
		ctx.beginPath();
		ctx.shadowColor = '#fff';
		ctx.fillStyle = "white";
		ctx.lineWidth = 10;
		this.pos.add();
	}

	target() {

	}
}

class TrackingLaser extends Laser {
	constructor(dir, pos, vel, color){
		super(dir, pos, vel, color);
		this.track = true;
	}

	move(ship_pos) {
		var trail = ship_pos.sub_new(this.pos);
		if (this.dir.dot(trail) < 0) {
			this.track = false;
		}
		if (this.track) {
			this.dir = trail.normalize();
			this.vel.add(this.dir.mul_new(0.1)).normalize();
		}
		this.pos.add(this.vel);
	}
}

class Drone extends Laser {
	constructor(dir, pos, vel, color) {
		super(dir, pos, vel, color);
	}

	move(ship_pos) {
		this.dir = ship_pos.sub_new(this.pos).normalize();
		this.vel.add(this.dir.mul_new(0.1));
		this.pos.add(this.vel);
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.vel.angle() + Math.PI / 2);
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.shadowColor = "#026900";
    	ctx.lineTo(0, -10);
    	ctx.lineTo(-15, 15);
    	ctx.lineTo(0, 7);
    	ctx.lineTo(15, 15);
    	ctx.lineTo(0, -10);
    	ctx.fill();
    	ctx.closePath();
		ctx.restore();
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================


class Particle extends Ray {
	constructor(dir, pos, vel) {
		super(dir, pos, vel);
		this.alpha = 1;
	}

	draw(ctx) {
		var old_color = ctx.fillStyle;
		ctx.beginPath();
		ctx.shadowColor = "#000000";
		// ctx.shadowBlur = 30;
		ctx.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
		drawLine(ctx, this.pos.x, this.pos.y, this.pos.x - this.dir.x * 20, this.pos.y - this.dir.y * 20);
		ctx.closePath();
		ctx.fillStyle = old_color;
		this.alpha -= 0.02;
	}
}

var keysPressed = {};

function eventKeyDown(event) {
	event = event || window.event;
	keysPressed[event.keyCode] = true;
	if (indexOf([code('up'),code('down'),code('right'),code('left'),code(' '),code('B'),code('W'),code('A'),code('S'),code('D')],event.keyCode)!=-1) {
		return false;
	}
}

function eventKeypress(event) {
	event = event || window.event;
	if (indexOf([code('up'),code('down'),code('right'),code('left'),code(' '),code('W'),code('A'),code('S'),code('D')],event.keyCode||event.which)!=-1) {
		return false;
	}
}

function eventKeyup(event) {
	event = event || window.event;
	keysPressed[event.keyCode] = false;
	if (indexOf([code('up'),code('down'),code('right'),code('left'),code(' '),code('B'),code('W'),code('A'),code('S'),code('D')],event.keyCode)!=-1) {
		return false;
	}
}

function indexOf(arr,item,from){
	return arr.indexOf(item,from);
};

document.addEventListener('keydown', eventKeyDown, false);
document.addEventListener("keypress", eventKeypress, false);
document.addEventListener("keyup", eventKeyup, false);

var last_update = new Date().getTime();
var bubble_update = new Date().getTime();

var control = [[code('W'), code('A'), code('D')],
			   [code('up'), code('left'), code('right')]];

window.onload = function() {
	var players = [new Playership(new Vector(w / 4, h / 2), new Vector(0, -1), 0, "#ff0000"), 
				   new Playership(new Vector(w * 3/ 4, h / 2), new Vector(0, -1), 1, "#0000ff")];
	var first = new Space("two-player", players, []);
	first.createFrame();
	setTimeout(function() {first.update()}, 50);
}