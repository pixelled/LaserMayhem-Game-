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

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

class Space {
	constructor(name, ship, objects) {
		this.name = name;
		this.keysPressed = {};
		this.ship = ship;
		this.objects = objects;
		this.lasers = [];
		this.particles = [];
	}

	createFrame() {
		var canvas = document.querySelector("#game");
		this.ctx = canvas.getContext("2d");
	}

	clear() {
		this.ctx.clearRect(0, 0, w, h);
	}

	update() {
		var now_time = new Date().getTime();
		var lasers = this.ship.lasers;
		if (!this.ship.control) {
			return;
		}
		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		if ((keysPressed[code('up')]) || (keysPressed[code('W')])) {
			this.ship.vel.add(this.ship.dir.mul_new(0.5));
		}
		else {
			this.ship.vel.mul_k(0.96);
		}

		if ((keysPressed[code('left')]) || (keysPressed[code('A')])) {
			this.ship.dir.rotate(radians(this.ship.rot_speed * 0.03*-1));
		}

		if ((keysPressed[code('right')]) || (keysPressed[code('D')])) {
			this.ship.dir.rotate(radians(this.ship.rot_speed*0.03));
		}

		if ((keysPressed[code(' ')] && now_time - this.ship.firedAt > this.ship.load)) {
			lasers.unshift(new Laser(this.ship.dir.copy(), this.ship.pos.copy(), this.ship.vel.copy(), "#00ff00"));
			this.ship.firedAt = now_time;
			if (lasers.length > this.ship.max_lasers) {
				lasers.shift(0);
			}
		}

		if (keysPressed[code('esc')]) {
			this.ship.explode();
			return
		}
		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		if (this.ship.vel.len() > this.ship.max_speed) {
			this.ship.vel.setlength(this.ship.max_speed);
		}

		this.ship.pos.add(this.ship.vel.mul_new(0.3));
		this.ship.check();

		for (var i = 0; i < lasers.length; i++) {
			var laserVel = lasers[i].dir.setlength_new(this.ship.bullet_speed * 0.03).add(lasers[i].vel.mul_new(0.03));
			lasers[i].pos.add(laserVel);
			var position = lasers[i].pos;
			if (position.x < 0 || position.x > w || position.y < 0 || position.y > h) {
					lasers.splice(i, 1);
				}
			for (var j = 0; j < this.objects.length; j++) {
				if (this.objects[j].target(position)) {
					this.particles = this.particles.concat(this.objects.splice(j, 1)[0].explode(this.objects));
					lasers.splice(i, 1);
				}
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].can_shoot && now_time - this.objects[i].last_shoot > this.objects[i].load) {
				this.lasers = this.lasers.concat(this.objects[i].shoot(this.ship, this.objects));
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].target(this.ship.pos)) {
				this.ship.health -= 1;
				this.ctx.save();
				this.ctx.translate(Math.random() * 5, Math.random() * 5);
			}
		}
		if (this.ship.health < 0)
			return false
		
		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		this.clear();
		this.ship.drawShip(this.ctx);

		if (lasers) {
			this.ship.drawLaser(this.ctx, lasers);
		}

		if (this.lasers) {
			for (var i = 0; i < this.lasers.length; i ++) {
				this.lasers[i].move(this.ship.pos);
				if (this.lasers[i].target(this.ship.pos)) {
					this.ship.health -= 1;
				}
				if (this.lasers[i].check()) {
					this.lasers.splice(i, 1);
				}
				else {
					this.lasers[i].draw(this.ctx);
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

		this.ctx.restore();
		this.ship.drawHealth(this.ctx);

		this.ship.lastPos = this.ship.pos;
		last_update = now_time;
		var that = this
		setTimeout(function() {that.update()}, 11);
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

class Body {
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

class Playership extends Body {
	constructor(pos, dir) {
		super(pos, 100);
		this.verts = [[-15, -10], [-7.5, 0], [-15, 10], [15, 0]];
		this.dir = dir;
		this.vel = new Vector(0, 0);
		this.control = true;
		this.max_speed = 25;
		this.rot_speed = 200;
		this.bullet_speed = 300;
		this.load = 100;
		this.firedAt = false;
		this.last_pos = false;
		this.lasers = [];
		this.max_lasers = 20;
	}

	drawShip(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.lineWidth = 3;
		ctx.shadowColor = "#00ff00";
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

	shoot() {
		return;
	}

	explode() {
		this.control = false;
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================


class NormalShip extends Body {
	constructor(pos, vel) {
		super(pos, 1);
		this.vel = vel;
		this.radius = 40;
		this.lasers = [];
		this.particles = [];
		this.max_particles = 30;
		this.can_shoot = true;
		this.last_shoot = 0;
		this.load = 500;
	}

	move() {
		this.pos.add(this.vel.mul_new(0.5));
	}
	
	shoot() {
		this.last_shoot = new Date().getTime();
		return [new Laser((new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(), this.pos.copy(), 3, "#ff0000")];
	}

	target(pos) {
		return this.pos.dist(pos) <= this.radius;
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.shadowColor = "#ff0000";
		ctx.shadowBlur = 5;
		ctx.translate(this.pos.x, this.pos.y);
		ctx.moveTo(-20, 0);
		ctx.bezierCurveTo(-16.8, 6.4, 15.4, 7.8, 20, 0);
		ctx.bezierCurveTo(20, -9.2, 13, -21, 0, -21);
		ctx.bezierCurveTo(-13, -21, -21, -9.2, -20, 0);
		ctx.fill();
		ctx.moveTo(-21, -9.2);
		ctx.bezierCurveTo(-29.2,-7.6, -40, -1.2, -37.2, 6.2);
		ctx.bezierCurveTo(-35, 15, -21, 20.6, 0, 21);
		ctx.bezierCurveTo(17, 21, 33.6, 16, 183/5, 8);
		ctx.bezierCurveTo(196/5, 1.2, 171/5, -5, 21.2, -8.6);
		ctx.bezierCurveTo(27, 6.8, 65/5, 8, 0, 8);
		ctx.bezierCurveTo(-12.4, 7.8, -144/5, 5.2, -21, -9.2);
		ctx.moveTo(-33.6, 6);
		ctx.ellipse(-32.4, 4, 2, 2.4, Math.PI / 3, 0, 2 * Math.PI);
		ctx.moveTo(0, 6);
		ctx.ellipse(0, 15.6, 2, 2.4, Math.PI / 2, 0, 2 * Math.PI);
		ctx.moveTo(33.6, 6);
		ctx.ellipse(32.4, 4, 2, 2.4, -Math.PI / 3, 0, 2 * Math.PI);
    	ctx.fill();
    	ctx.closePath();
    	ctx.restore();
	}

	explode() {
		for (var k = 0; k < this.max_particles; k++) {
			var x = Math.random() * 20 - 10;
			this.particles.push(new Particle((new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(), this.pos.copy(), 10));
		}
		return this.particles;
	}
}

class Sniper extends NormalShip {
	constructor(pos, vel) {
		super(pos, vel);
		this.load = 1000;
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		var shoot_dir = player.pos.sub_new(this.pos).normalize();
		return [new Laser(shoot_dir, this.pos.copy(), 5, "#ff0000")];
	}
}

class SuperSniper extends Sniper {
	shoot(player) {
		this.last_shoot = new Date().getTime();
		var guess_pos1 = player.pos.add_new(player.vel.mul_new(10));
		var guess_pos2 = player.pos.add_new(player.vel.mul_new(5));
		var guess_pos3 = player.pos.add_new(player.vel.mul_new(15));
		var shoot_dir1 = guess_pos1.sub_new(this.pos).normalize();
		var shoot_dir2 = guess_pos2.sub_new(this.pos).normalize();
		var shoot_dir3 = guess_pos3.sub_new(this.pos).normalize();
		return [new Laser(shoot_dir1, this.pos.copy(), 15, "#ff0000"),
				new Laser(shoot_dir2, this.pos.copy(), 15, "#ff0000"),
				new Laser(shoot_dir3, this.pos.copy(), 15, "#ff0000")];
	}
}

class Spread extends NormalShip {
	constructor(pos, vel) {
		super(pos, vel);
		this.load = 3000;
		this.max_lasers = 10;
	}
	
	shoot(player) {
		this.last_shoot = new Date().getTime();
		var shoot_lasers = [];
		for (var k = 0; k < this.max_lasers; k++) {
			shoot_lasers.push(new Laser(new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10).normalize(), this.pos.copy(), 3, "#0000ff"));
		}
		return shoot_lasers;
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
    	ctx.strokeStyle = "white";
    	ctx.lineWidth = 3;
    	ctx.translate(this.pos.x, this.pos.y);
    	ctx.arc(0, -10, 21, 0, Math.PI, true);
    	ctx.moveTo(18, 10);
    	ctx.arc(0, -10, 30, Math.PI * 1.5 / 6, Math.PI * 4.5 / 6);
    	ctx.moveTo(-24, -10);
    	ctx.lineTo(24, -10);
    	ctx.lineTo(28, -5);
    	ctx.moveTo(35, 0);
    	ctx.arc(30, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(33, 2);
    	ctx.lineTo(40, 10);
    	ctx.lineTo(-40, 10);
    	ctx.lineTo(-33, 2);
    	ctx.moveTo(-28, -5);
    	ctx.lineTo(-23, -10);
    	ctx.moveTo(5, 0);
    	ctx.arc(0, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(-25, 0);
    	ctx.arc(-30, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(0, 0);
    	ctx.stroke();
    	ctx.closePath();
    	ctx.restore()
	}
}

class Destroyer extends NormalShip {
	constructor(pos, vel) {
		super(pos, vel);
		this.load = 3000;
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		var shoot_dir = player.pos.sub_new(this.pos).normalize();
		return [new RoundLaser(shoot_dir, this.pos.copy(), 1, "#0000ff", 20)];
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
    	ctx.strokeStyle = "white";
    	ctx.lineWidth = 3;
    	ctx.translate(this.pos.x, this.pos.y);
    	ctx.arc(0, -10, 21, 0, Math.PI, true);
    	ctx.moveTo(18, 10);
    	ctx.arc(0, -10, 30, Math.PI * 1.5 / 6, Math.PI * 4.5 / 6);
    	ctx.moveTo(-24, -10);
    	ctx.lineTo(24, -10);
    	ctx.lineTo(28, -5);
    	ctx.moveTo(35, 0);
    	ctx.arc(30, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(33, 2);
    	ctx.lineTo(40, 10);
    	ctx.lineTo(-40, 10);
    	ctx.lineTo(-33, 2);
    	ctx.moveTo(-28, -5);
    	ctx.lineTo(-23, -10);
    	ctx.moveTo(5, 0);
    	ctx.arc(0, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(-25, 0);
    	ctx.arc(-30, 0, 5, 0, 2*Math.PI);
    	ctx.stroke();
    	ctx.closePath();
    	ctx.restore();
	}
}

class Skimmer extends Destroyer {
	constructor(pos, vel) {
		super(pos, vel);
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		var shoot_dir = player.pos.sub_new(this.pos).normalize();
		return [new UpLaser(shoot_dir, this.pos.copy(), 1, "#1FEB00", 5)];
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
    	ctx.strokeStyle = "white";
    	ctx.lineWidth = 3;
    	ctx.translate(this.pos.x, this.pos.y);
    	ctx.arc(0, -10, 21, 0, Math.PI, true);
    	ctx.moveTo(18, 10);
    	ctx.arc(0, -10, 30, Math.PI * 1.5 / 6, Math.PI * 4.5 / 6);
    	ctx.moveTo(-24, -10);
    	ctx.lineTo(24, -10);
    	ctx.lineTo(28, -5);
    	ctx.moveTo(35, 0);
    	ctx.arc(30, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(33, 2);
    	ctx.lineTo(40, 10);
    	ctx.lineTo(-40, 10);
    	ctx.lineTo(-33, 2);
    	ctx.moveTo(-28, -5);
    	ctx.lineTo(-23, -10);
    	ctx.moveTo(5, 0);
    	ctx.arc(0, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(-25, 0);
    	ctx.arc(-30, 0, 5, 0, 2*Math.PI);
    	ctx.moveTo(-10, -20);
    	ctx.lineTo(-8, -20);
    	ctx.moveTo(10, -20);
    	ctx.lineTo(8, -20);
    	ctx.stroke();
    	ctx.closePath();
    	ctx.restore();
	}
}

class Annihilator extends Sniper {
	constructor(pos, vel) {
		super(pos, vel);
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		var shoot_dir = player.pos.sub_new(this.pos);
		return [new LineLaser()];
	}
}

class Trapper extends NormalShip {
	constructor(pos, vel) {
		super(pos, vel);
	}

	shoot(_, objects) {
		this.last_shoot = new Date().getTime();
		objects.push(new SmallAsteroid(this.pos.copy(), new Vector(1, -1), new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5), 1));
		return [];
	}
}

class Tracker extends NormalShip {
	constructor(pos, vel) {
		super(pos, vel);
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		var init_dir = player.pos.sub_new(this.pos).normalize();
		return [new TrackingLaser(init_dir, this.pos.copy(), init_dir, "#fff")];
	}
}

class Overlord extends NormalShip {
	constructor(pos, vel) {
		super(pos, vel);
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		var init_dir = player.pos.sub_new(this.pos).normalize();
		return [new Drone(init_dir, this.pos.copy(), init_dir, "#fff")];
	}

	draw(ctx) {
		ctx.save();
    	ctx.strokeStyle = "#00AB94";
    	ctx.shadowColor = "white";
    	ctx.shadowBlur = 10;
    	ctx.lineWidth = 4;
    	ctx.translate(this.pos.x, this.pos.y);
    	ctx.beginPath();
    	ctx.arc(-25, -25, 12, 0, 2 * Math.PI);
    	ctx.moveTo(37, -25);
    	ctx.arc(25, -25, 12, 0, 2 * Math.PI);
    	ctx.moveTo(37, 25);
    	ctx.arc(25, 25, 12, 0, 2 * Math.PI);
    	ctx.moveTo(-13, 25);
    	ctx.arc(-25, 25, 12, 0, 2 * Math.PI);
    	ctx.stroke();
    	ctx.closePath();
    	ctx.beginPath();
    	ctx.strokeStyle = "#E1FFE0";
    	ctx.moveTo(-25, -25);
    	ctx.bezierCurveTo(-15, -4, 15, -4, 25, -25);
    	ctx.bezierCurveTo(10, -4, 10, 4, 25, 25);
    	ctx.bezierCurveTo(10, 4, -10, 4, -25, 25);
    	ctx.bezierCurveTo(-10, 4, -10, -4, -25, -25);
    	ctx.stroke();
    	ctx.closePath();
    	ctx.restore();
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

class Asteroid extends Body{
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
	constructor(dir, pos, vel, color) {
		super(dir, pos, vel);
		this.color = color
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