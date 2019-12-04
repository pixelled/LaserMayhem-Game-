var level;
var choice;
$(function() {
	$(".container").fadeIn(300);
	var canvas = document.querySelector("#game");
	var w = canvas.scrollWidth;
	var h = canvas.scrollHeight;
	canvas.width = w;
	canvas.height = h;

	var ship_img = new Image();
	var asteroid_img = new Image();
	var small_asteroid_img = new Image();
	var meteor_img = new Image();
	var normal_ship_img = new Image();
	var sniper_img = new Image();
	var super_sniper_img = new Image();
	var destroyer_img = new Image();
	var skimmer_img = new Image();
	var trapper_img = new Image();
	var spread_img = new Image();
	var smasher_img = new Image();
	var spiker_img = new Image();
	var tracker_img = new Image();
	var overlord_img = new Image();
	var annihilator_img = new Image();

	ship_img.src = "assets/img/test1.png";
	asteroid_img.src = "assets/img/asteroid.png";
	small_asteroid_img.src = "assets/img/small_asteroid.png";
	normal_ship_img.src = "assets/img/normal_ship.png";
	sniper_img.src = "assets/img/sniper.png";
	super_sniper_img.src = "assets/img/super_sniper.png";
	destroyer_img.src = "assets/img/destroyer.png";
	skimmer_img.src = "assets/img/skimmer.png";
	trapper_img.src = "assets/img/trapper.png";
	spread_img.src = "assets/img/spread.png";
	smasher_img.src = "assets/img/smasher.png";
	spiker_img.src = "assets/img/spiker.png";
	tracker_img.src = "assets/img/tracker.png";
	overlord_img.src = "assets/img/overlord.png";
	annihilator_img.src = "assets/img/annihilator.png";

	$("#back_img").hover(function() {
		$("#back").css("background", "#438DCB");
	}, function() {
		$("#back").css("background", "#002E73");
	});
	$("#back").hover(function() {
		$("#back").css("background", "#438DCB");
	}, function() {
		$("#back").css("background", "#002E73");
	});

	$("#back1_img").hover(function() {
		$("#back").css("background", "#438DCB");
	}, function() {
		$("#back").css("background", "#002E73");
	});
	$("#back").hover(function() {
		$("#back").css("background", "#438DCB");
	}, function() {
		$("#back").css("background", "#002E73");
	});

	$("#start_img").hover(function() {
		$("#start").css("background", "#E64F5B");
	}, function() {
		$("#start").css("background", "#AB000D");
	});
	$("#start_img").hover(function() {
		$("#start").css("background", "#E64F5B");
	}, function() {
		$("#start").css("background", "#AB000D");
	});

	$(".level").click(function(e) {
		level = "level" + e.target.id.slice(-2);
		$("#setup").fadeToggle("fast");
		$("#start_nav").fadeToggle("fast");
		$("#back_img").fadeToggle("fast");
		$("#back1_img").fadeToggle("fast");
	});

	$(".level").hover(function(e) {
		level = "level" + e.target.id.slice(-2);
		$("#" + level).css("width", "530px").css("left", "-7.5px");
	}, function() {
		$("#" + level).css("width", "515px").css("left", "0px");
	})

	$("#back1_img").click(function() {
		$("#setup").fadeToggle("fast");
		$("#start_nav").fadeToggle("fast");
		$("#back_img").fadeToggle("fast");
		$("#back1_img").fadeToggle("fast");
	});

	$("#resume_img").hover(function() {
		$("#resume_square").css("background", "#5FA4E3");
	}, function() {
		$("#resume_square").css("background", "#0068B7");
	});

	$("#exit_img").hover(function() {
		$("#exit_square").css("background", "#022252");
	}, function() {
		$("#exit_square").css("background", "#003567");
	});

	$(".card").click(function(e) {
		choice = e.target.id;
		$("#best").css("border-color", "#000");
		$("#spin").css("border-color", "#000");
		$("#" + choice).css("border-color", "#FFA000");
	})

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
	ctx.fill();
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
	constructor(name, ship, objects, rest) {
		this.name = name;
		this.ship = ship;
		this.objects = objects;
		this.rest = rest;
		this.lasers = [];
		this.particles = [];
		this.max_obj = 2;
		this.draw = true;
		this.dark = false;
		this.last_update = new Date().getTime();
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

		if (keysPressed[code('esc')]) {
			$("#pause").css("display", "initial");
			return;
		}

		if ((this.objects.length < this.max_obj || (now_time - this.last_update > 10000)) && this.rest.length > 0) {
			this.objects.push(this.rest.splice(0, 1)[0]);
			this.last_update = now_time;
		}

		if (!this.objects.length) {
			$("#complete").fadeIn(1000);
			setTimeout(function() {
				location.reload();
			}, 2000);
		}
		
		if (this.ship instanceof DeadShip) {
			$("#failed").fadeIn(1000);
			setTimeout(function() {
				location.reload();
			}, 1500);
		}

		var lasers = this.ship.lasers;
		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		
		this.ship.move();
		this.ship.shoot(now_time);
		this.ship.check();

		// ===================================================================================================================================================================
		// ===================================================================================================================================================================

		for (var i = 0; i < lasers.length; i++) {
			/*
			var laserVel = lasers[i].dir.setlength_new(this.ship.bullet_speed * 0.03).add(lasers[i].vel.mul_new(0.03));
			lasers[i].pos.add(laserVel);
			var position = lasers[i].pos;
			var dir = lasers[i].dir;
			if (position.x < 0 || position.x > w || position.y < 0 || position.y > h) {
				lasers.splice(i, 1);
				i > 0 ? i--: i;
				continue;
			}
			*/
			lasers[i].move();
			var position = lasers[i].pos;
			var dir = lasers[i].dir;
			if (lasers[i].check()) {
				lasers.splice(i, 1);
				i--;
				continue;
			}
			for (var j = 0; j < this.objects.length; j++) {
				if (lasers[i].target(this.objects[j])) {
					this.objects[j].health -= lasers[i].damage;
					lasers.splice(i, 1);
					this.particles.push(new Particle(dir.mul_new(-1), position.copy(), 1));
					this.particles.push(new Particle(dir.add_new(new Vector(-0.3, 0.3)), position.copy(), 1));
					break;
				}
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].can_shoot && now_time - this.objects[i].last_shoot > this.objects[i].load) {
				this.lasers = this.lasers.concat(this.objects[i].shoot(this.ship, this.objects));
			}
			if (this.objects[i].target(this.ship.pos)) {
				this.ship.health -= this.objects[i].body;
				this.objects[i].health -= 0.5;
				this.ctx.save();
				this.ctx.translate(Math.random() * 5, Math.random() * 5);
			}
			if (this.objects[i].health <= 0) {
				this.particles = this.particles.concat(this.objects.splice(i, 1)[0].explode(this.objects));
				i--;
			}
		}

		if (this.ship.health < 0) {
			var ship_position = this.ship.pos;
			this.ship = new DeadShip(new Vector(1.1 * w, 1.1 * h), new Vector(0, -1));
            this.particles = this.particles.concat([new Particle(new Vector(1, 0), ship_position.copy(), 10),new Particle(new Vector(0.95, 0.31), ship_position.copy(), 10),new Particle(new Vector(0.81, 0.59), ship_position.copy(), 10),new Particle(new Vector(0.59, 0.81), ship_position.copy(), 10),new Particle(new Vector(0.31, 0.95), ship_position.copy(), 10),new Particle(new Vector(0, 1), ship_position.copy(), 10),new Particle(new Vector(-0.31, 0.95), ship_position.copy(), 10),new Particle(new Vector(-0.59, 0.81), ship_position.copy(), 10),new Particle(new Vector(-0.81, 0.59), ship_position.copy(), 10),new Particle(new Vector(-0.95, 0.31), ship_position.copy(), 10),new Particle(new Vector(-1, 0), ship_position.copy(), 10),new Particle(new Vector(-0.95, -0.31), ship_position.copy(), 10),new Particle(new Vector(-0.81, -0.59), ship_position.copy(), 10),new Particle(new Vector(-0.59, -0.81), ship_position.copy(), 10),new Particle(new Vector(-0.31, -0.95), ship_position.copy(), 10),new Particle(new Vector(0, -1), ship_position.copy(), 10),new Particle(new Vector(0.31, -0.95), ship_position.copy(), 10),new Particle(new Vector(0.59, -0.81), ship_position.copy(), 10),new Particle(new Vector(0.81, -0.59), ship_position.copy(), 10)]);
		}
		
		// ===================================================================================================================================================================
		// ===================================================================================================================================================================
		this.clear();

		this.ship.drawShip(this.ctx);

		if (lasers) {
			this.ship.drawLaser(this.ctx, lasers);
		}

		for (var i = 0; i < this.lasers.length; i++) {
			this.lasers[i].move(this.ship.pos);
			if (this.lasers[i].target(this.ship)) {
				this.ship.health -= this.lasers[i].damage;
				this.particles.push(new Particle(this.lasers[i].dir.mul_new(-2), this.lasers[i].pos.copy(), 2));
				this.particles.push(new Particle(this.lasers[i].dir.mul_new(2), this.lasers[i].pos.copy(), 2));
				this.lasers.splice(i, 1);
				i--;
			}
			else if (this.lasers[i].check(now_time)) {
				this.lasers.splice(i, 1);
				i--;
			}
			else if (!this.darkdark || this.lasers[i].pos.dist(this.ship.pos) < 300) {
				this.lasers[i].draw(this.ctx);
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].move(this.ship);
			this.objects[i].check();
			if (this.draw || (this.dark && (this.objects[i].pos.dist(this.ship.pos) < 300)))
				this.objects[i].draw(this.ctx);
		}

		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].pos.add(this.particles[i].dir.mul_new(this.particles[i].vel));
			if (this.particles[i].check() || this.particles[i].alpha < 0.4) {
				this.particles.splice(i, 1);
			}
			else if (!this.dark || this.particles[i].pos.dist(this.ship.pos) < 300) {
				this.particles[i].draw(this.ctx);
			}
		}

		if (this.dark) {
			var x = this.ship.pos.x;
			var y = this.ship.pos.y;
			this.ctx.beginPath();
			this.ctx.fillStyle = "black";
			this.ctx.moveTo(0, 0);
			this.ctx.lineTo(w, 0);
			this.ctx.lineTo(w, h);
			this.ctx.lineTo(0, h);
			this.ctx.lineTo(0, 0);
			this.ctx.lineTo(x - 200, y);
			this.ctx.bezierCurveTo(x - 200, y + 110, x - 110, y + 200, x, y + 200);
			this.ctx.bezierCurveTo(x + 110, y + 200, x + 200, y + 110, x + 200, y);
			this.ctx.bezierCurveTo(x + 200, y - 110, x + 110, y - 200, x, y - 200);
			this.ctx.bezierCurveTo(x - 110, y - 200, x - 200, y - 110, x - 200, y);
			this.ctx.fill();
			this.ctx.closePath();
		}

		this.ctx.restore();
		this.ship.drawHealth(this.ctx);
		var fps = now_time - last_update;
		last_update = now_time;
		var that = this
		setTimeout(function() {that.update()}, 14 - fps);
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================

class Body {
	constructor(pos, health) {
		this.pos = pos;
		this.health = health;
		this.can_shoot = false;
		this.body = 0.5;
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
		super(pos, 10);
		this.dir = dir;
		this.vel = new Vector(0, 0);
		this.control = true;
		this.max_speed = 20;
		this.bullet_speed = 300;
		this.load = 150;
		this.firedAt = false;
		this.lasers = [];
		this.max_lasers = 20;
		this.max_length = 250;
		this.radius = 25;
	}

	move() {
		if ((keysPressed[code('up')]) || (keysPressed[code('W')])) {
			this.vel.add(this.dir);
		}
		else {
			this.vel.mul_k(0.96);
		}

		if ((keysPressed[code('left')]) || (keysPressed[code('A')])) {
			this.dir.rotate(-0.08);
		}

		if ((keysPressed[code('right')]) || (keysPressed[code('D')])) {
			this.dir.rotate(0.08);
		}

		if (keysPressed[code('S')]) {
			this.vel.sub(this.dir);
		}

		if (this.vel.len() > this.max_speed) {
			this.vel.setlength(this.max_speed);
		}

		this.pos.add(this.vel.mul_new(0.3));
	}

	drawShip(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.shadowColor = "#0000ff";
		ctx.drawImage(ship_img, -30, -30);
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
		ctx.strokeStyle = "white";
		ctx.shadowColor = "#ff0000";
		ctx.shadowBlur = 5;
		ctx.lineWidth = 10;
		if (this.health >= 0) {
			ctx.beginPath();
			ctx.moveTo(50, 40);
			ctx.lineTo(this.health * 20 + 50, 40);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(45, 30);
		ctx.lineTo(this.max_length + 5, 30);
		ctx.lineTo(this.max_length + 5, 50);
		ctx.lineTo(45, 50);
		ctx.lineTo(45, 30);
		ctx.stroke();
		ctx.closePath();
	}

	shoot(now_time) {
		if ((keysPressed[code(' ')] && now_time - this.firedAt > this.load)) {
		//	this.lasers.unshift(new Laser(this.dir.copy(), this.pos.copy(), this.vel.copy(), "#0000ff"));
			this.lasers.unshift(new Laser(this.dir.copy().normalize(), this.pos.copy(), 10, "#0000ff"));
			this.firedAt = now_time;
		}
	}
}

class SpreadPlayer extends Playership {
	constructor(pos, dir) {
		super(pos, dir);
	}

	move() {
		if ((keysPressed[code('up')]) || (keysPressed[code('W')])) {
			this.vel.add(this.dir);
		}
		else {
			this.vel.mul_k(0.99);
		}

		if ((keysPressed[code('left')]) || (keysPressed[code('A')])) {
			this.dir.rotate(-0.08);
		}

		if ((keysPressed[code('right')]) || (keysPressed[code('D')])) {
			this.dir.rotate(0.08);
		}

		if (keysPressed[code('S')]) {
			this.vel.sub(this.dir);
		}

		if (this.vel.len() > this.max_speed) {
			this.vel.setlength(this.max_speed);
		}

		this.pos.add(this.vel.mul_new(0.3));
	}

	shoot(now_time) {
		if ((keysPressed[code(' ')] && now_time - this.firedAt > this.load)) {
			this.lasers.unshift(new Laser(this.dir.copy().normalize(), this.pos.copy(), 10, "#0000ff"));
			this.lasers.unshift(new Laser(this.dir.copy().rotate(Math.PI / 6).normalize(), this.pos.copy(), 10, "#0000ff"));
			this.lasers.unshift(new Laser(this.dir.copy().rotate(-Math.PI / 6).normalize(), this.pos.copy(), 10, "#0000ff"));
			this.firedAt = now_time;
		}
	}
}

class SpinPlayer extends Playership {
	constructor(pos, dir) {
		super(pos, dir);
		this.load = 2000;
		this.health = 100;
		this.max_length = 2500;
	}

	move() {
		if ((keysPressed[code('up')]) || (keysPressed[code('W')])) {
			this.vel.add(this.dir);
		}
		else {
			this.vel.mul_k(0.96);
		}

		if ((keysPressed[code('left')]) || (keysPressed[code('A')])) {
			this.dir.rotate(-0.08);
		}

		if ((keysPressed[code('right')]) || (keysPressed[code('D')])) {
			this.dir.rotate(0.08);
		}

		if (keysPressed[code('S')]) {
			this.vel.sub(this.dir);
		}

		if (this.vel.len() > this.max_speed) {
			this.vel.setlength(this.max_speed);
		}

		this.pos.add(this.vel.mul_new(0.3));
	}

	drawShip(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.shadowColor = "#0000ff";
		ctx.drawImage(ship_img, -30, -30);
		ctx.restore();
	}
}

class DirectPlayer extends Playership {
	constructor(pos, dir) {
		super(pos, dir);
		this.load = 500;
	}

	shoot(now_time) {
		if ((keysPressed[code(' ')] && now_time - this.firedAt > this.load)) {
			this.lasers.unshift(new LineLaser(this.pos.copy(), this.pos, 0.01, this.dir.y / this.dir.x));
			this.firedAt = now_time;
		}
	}
}

class DeadShip extends Playership {
	move() {
		return;
	}

	checkLive() {
		return true;
	}

	drawShip() {
		return;
	}

	drawHealth() {
		return;
	}

	check() {
		return;
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================


class NormalShip extends Body {
	constructor(pos, vel) {
		super(pos, 5);
		this.vel = vel;
		this.radius = 25;
		this.lasers = [];
		this.particles = [];
		this.max_particles = 30;
		this.can_shoot = true;
		this.last_shoot = 0;
		this.load = 500;
	}

	move() {
		this.pos.add(this.vel);
	}
	
	shoot() {
		this.last_shoot = new Date().getTime();
		return [new Laser((new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(), this.pos.copy(), 3, "#ff0000")];
	}

	target(pos) {
		return this.pos.dist(pos) <= this.radius + 25;
	}

	draw(ctx) {
		ctx.save();
		ctx.shadowColor = "#0000ff";
		ctx.shadowBlur = 5;
		ctx.translate(this.pos.x, this.pos.y);
		ctx.drawImage(normal_ship_img, -50, -20);
    	ctx.restore();
	}

	explode() {
		return [new Particle(new Vector(1, 0), this.pos.copy(), 10),new Particle(new Vector(0.95, 0.31), this.pos.copy(), 10),new Particle(new Vector(0.81, 0.59), this.pos.copy(), 10),new Particle(new Vector(0.59, 0.81), this.pos.copy(), 10),new Particle(new Vector(0.31, 0.95), this.pos.copy(), 10),new Particle(new Vector(0, 1), this.pos.copy(), 10),new Particle(new Vector(-0.31, 0.95), this.pos.copy(), 10),new Particle(new Vector(-0.59, 0.81), this.pos.copy(), 10),new Particle(new Vector(-0.81, 0.59), this.pos.copy(), 10),new Particle(new Vector(-0.95, 0.31), this.pos.copy(), 10),new Particle(new Vector(-1, 0), this.pos.copy(), 10),new Particle(new Vector(-0.95, -0.31), this.pos.copy(), 10),new Particle(new Vector(-0.81, -0.59), this.pos.copy(), 10),new Particle(new Vector(-0.59, -0.81), this.pos.copy(), 10),new Particle(new Vector(-0.31, -0.95), this.pos.copy(), 10),new Particle(new Vector(0, -1), this.pos.copy(), 10),new Particle(new Vector(0.31, -0.95), this.pos.copy(), 10),new Particle(new Vector(0.59, -0.81), this.pos.copy(), 10),new Particle(new Vector(0.81, -0.59), this.pos.copy(), 10)];
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

	draw(ctx) {
		ctx.save();
		ctx.shadowColor = "#ff0000";
		ctx.translate(this.pos.x, this.pos.y);
		ctx.drawImage(sniper_img, -74, -30);
    	ctx.restore();
	}
}

class SuperSniper extends Sniper {
	constructor(pos, vel) {
		super(pos, vel);
		this.load = 2000;
		this.radius = 33;
	}

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
		this.load = 1500;
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
		ctx.shadowColor = "#0000ff";
		ctx.translate(this.pos.x, this.pos.y);
		ctx.drawImage(spread_img, -61, -25);
    	ctx.restore();
	}
}

class SpreadMaster extends Spread {
	constructor(pos, vel) {
		this.load = 100;
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
		return [new RoundLaser(shoot_dir, this.pos.copy(), 1, "#00ff00", 30)];
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.shadowColor = "#00ff00";
		ctx.drawImage(destroyer_img, -50, -20);
    	ctx.restore();
	}
}

class Skimmer extends Destroyer {
	constructor(pos, vel) {
		super(pos, vel);
		this.radius = 35;
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		var shoot_dir = player.pos.sub_new(this.pos).normalize();
		return [new UpLaser(shoot_dir, this.pos.copy(), 1, "#1FEB00", 5)];
	}

	draw(ctx) {
		ctx.save();
		ctx.shadowColor = "#00ff00";
		ctx.shadowBlur = 5;
		ctx.translate(this.pos.x, this.pos.y);
		ctx.drawImage(skimmer_img, -50, -20);
    	ctx.restore();
	}
}

class Annihilator extends Sniper {
	constructor(pos, vel) {
		super(pos, vel);
		this.load = 1000;
	}

	shoot(player) {
		this.last_shoot = new Date().getTime();
		return [new LineLaser(player.pos.copy(), this.pos, 0.01, (player.pos.y - this.pos.y) / (player.pos.x - this.pos.x))];
	}
}

class Spiker extends NormalShip {
	constructor(pos, vel, dir) {
		super(pos, vel);
		this.dir = dir;
		this.radius = 60;
	}

	move(player) {
		this.vel = (player.pos.sub_new(this.pos)).normalize().mul_k(3);
		this.pos.add(this.vel);
		this.dir.rotate(Math.PI/14);
	}

	shoot() {
		return [];
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.shadowColor = "#fff";
		ctx.shadowBlur = 30;
		ctx.drawImage(smasher_img, -60, -60);
		ctx.restore();
	}
}

class Smasher extends Spiker {
	constructor(pos, vel, dir) {
		super(pos, vel);
		this.dir = dir;
		this.radius = 35;
	}

	move(player) {
		this.dir = player.pos.sub_new(this.pos).normalize();
		this.vel.add(this.dir.mul_new(0.1));
		this.pos.add(this.vel);
	}

	shoot() {
		return [];
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.vel.angle());
		ctx.drawImage(spiker_img, -35, -35);
		ctx.restore();
	}
}

class Trapper extends NormalShip {
	constructor(pos, vel) {
		super(pos, vel);
		this.health = 15;
		this.radius = 50;
	}

	shoot(_, objects) {
		this.last_shoot = new Date().getTime();
		objects.push(new SmallAsteroid(this.pos.copy(), new Vector(1, -1), new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5), 5));
		return [];
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.shadowColor = "grey";
		ctx.drawImage(trapper_img, -50, -50);
		ctx.restore();
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
		this.radius = 40;
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
		this.radius = 40;
		this.particles = [];
	}

	move() {
		this.pos.add(this.vel.mul_new(0.3));
		this.dir.rotate(0.02);
	}

	target(pos) {
		return this.pos.dist(pos) <= this.radius + 25;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.shadowColor = "#000";
		ctx.drawImage(asteroid_img, -40, -40);
		ctx.restore();
	}

	explode(objects) {
		for (var v = 0; v < 4; v++) {
			objects.push(new SmallAsteroid(this.pos.copy(), new Vector(1, -1), new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5), 5));
		}

		return [new Particle(new Vector(1, 0), this.pos.copy(), 10), new Particle(new Vector(0.98, 0.21), this.pos.copy(), 10), new Particle(new Vector(0.91, 0.41), this.pos.copy(), 10), new Particle(new Vector(0.81, 0.59), this.pos.copy(), 10), new Particle(new Vector(0.67, 0.95), this.pos.copy(), 10), new Particle(new Vector(0.5, 0.87), this.pos.copy(), 10),new Particle(new Vector(0.31, 0.95), this.pos.copy(), 10),new Particle(new Vector(0.1, 0.99), this.pos.copy(), 10),new Particle(new Vector(-0.1, 0.99), this.pos.copy(), 10), new Particle(new Vector(-0.31, 0.95), this.pos.copy(), 10),new Particle(new Vector(-0.5, 0.87), this.pos.copy(), 10),new Particle(new Vector(-0.67, 0.95), this.pos.copy(), 10),new Particle(new Vector(-0.81, 0.59), this.pos.copy(), 10),new Particle(new Vector(-0.91, 0.41), this.pos.copy(), 10),new Particle(new Vector(-0.98, 0.21), this.pos.copy(), 10),new Particle(new Vector(-1, 0), this.pos.copy(), 10),new Particle(new Vector(-0.98, -0.21), this.pos.copy(), 10),new Particle(new Vector(-0.91, -0.41), this.pos.copy(), 10),new Particle(new Vector(-0.81, -0.59), this.pos.copy(), 10),new Particle(new Vector(-0.67, -0.95), this.pos.copy(), 10),new Particle(new Vector(-0.5, -0.87), this.pos.copy(), 10),new Particle(new Vector(-0.31, -0.95), this.pos.copy(), 10),new Particle(new Vector(-0.1, -0.99), this.pos.copy(), 10),new Particle(new Vector(0.1, -0.99), this.pos.copy(), 10),new Particle(new Vector(0.31, -0.95), this.pos.copy(), 10),new Particle(new Vector(0.5, -0.87), this.pos.copy(), 10),new Particle(new Vector(0.67, -0.95), this.pos.copy(), 10), new Particle(new Vector(0.81, -0.59), this.pos.copy(), 10),new Particle(new Vector(0.91, -0.41), this.pos.copy(), 10),new Particle(new Vector(0.98, -0.21), this.pos.copy(), 10)];
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
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.dir.angle());
		ctx.shadowColor = "#000";
		ctx.drawImage(small_asteroid_img, -20, -20);
		ctx.restore();
	}

	explode() {
		return [new Particle(new Vector(1, 0), this.pos.copy(), 10),new Particle(new Vector(0.95, 0.31), this.pos.copy(), 10),new Particle(new Vector(0.81, 0.59), this.pos.copy(), 10),new Particle(new Vector(0.59, 0.81), this.pos.copy(), 10),new Particle(new Vector(0.31, 0.95), this.pos.copy(), 10),new Particle(new Vector(0, 1), this.pos.copy(), 10),new Particle(new Vector(-0.31, 0.95), this.pos.copy(), 10),new Particle(new Vector(-0.59, 0.81), this.pos.copy(), 10),new Particle(new Vector(-0.81, 0.59), this.pos.copy(), 10),new Particle(new Vector(-0.95, 0.31), this.pos.copy(), 10),new Particle(new Vector(-1, 0), this.pos.copy(), 10),new Particle(new Vector(-0.95, -0.31), this.pos.copy(), 10),new Particle(new Vector(-0.81, -0.59), this.pos.copy(), 10),new Particle(new Vector(-0.59, -0.81), this.pos.copy(), 10),new Particle(new Vector(-0.31, -0.95), this.pos.copy(), 10),new Particle(new Vector(0, -1), this.pos.copy(), 10),new Particle(new Vector(0.31, -0.95), this.pos.copy(), 10),new Particle(new Vector(0.59, -0.81), this.pos.copy(), 10),new Particle(new Vector(0.81, -0.59), this.pos.copy(), 10)];
	}
}

// =======================================================================================================================================================================================
// =======================================================================================================================================================================================


class Ray {
	constructor(dir, pos, vel) {
		this.dir = dir;
		this.pos = pos;
		this.vel = vel;
		this.damage = 1;
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
		ctx.fillStyle = "white";
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 3;
		drawCurve(ctx, this.pos.x, this.pos.y, this.pos.x - this.dir.x*20, this.pos.y - this.dir.y*20);
	}

	target(ship) {
		return this.pos.dist(ship.pos) < ship.radius;
	}
}

class RoundLaser extends Laser {
	constructor(dir, pos, vel, color, radius) {
		super(dir, pos, vel, color);
		this.radius = radius;
		this.damage = 2.5;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 40;
		ctx.fillStyle = "white";
		ctx.arc(this.pos.x, this.pos.y, this.radius - 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	target(ship) {
		return this.pos.dist(ship.pos) < ship.radius + this.radius;
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
	constructor(dir, pos, vel, slope) {
		super(dir, pos, vel);
		this.width = 0;
		this.k = slope;
		this.damage = 1;
		this.init = new Date().getTime();
	}

	move() {
		return;
	}

	target(ship) {
		var d = (-this.k * ship.pos.x + ship.pos.y + this.k * this.pos.x + this.pos.y) / ((1 + this.k ** 2) ** 0.5)
		if (this.width >= 20 && d < this.width) {
			return true;
		}
		return false;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.lineWidth = this.width;
		ctx.strokeStyle = "white";
		ctx.moveTo(this.pos.x, this.pos.y);
		if (this.dir.x < this.pos.x) {
			ctx.lineTo(-2000, (-2000 - this.pos.x) * this.k + this.pos.y);
		}
		else {
			ctx.lineTo(2000, (2000 - this.pos.x) * this.k + this.pos.y);
		}
		ctx.stroke();
		ctx.closePath();
		if (this.width > 2) {
			this.vel = 1;
		}
		if (this.width < 20)
			this.width += this.vel;
	}

	check(now_time) {
		return this.pos.x < 0 || this.pos.x > w || this.pos.y < 0 || this.pos.y > h || now_time - this.init > 2000;
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

	$("#start_game").click(function() {
		$(".container").css("display", "none");
		$("#game").css("visibility", "visible");
		var ship_one = new SpreadPlayer(new Vector(w / 2, h / 2), new Vector(0, -0.3));
		var dead_ship = new DeadShip(new Vector(w / 2, h / 2), new Vector(0, -1));
		var asteroid_01 = new SmallAsteroid(new Vector(w / 3, h / 3), new Vector(5, -5), new Vector(5, -5), 5);
		var asteroid_02 = new Asteroid(new Vector(w * 2 / 3, h * 3 / 4), new Vector(-2, 2), new Vector(1, -1), 10);
		var asteroid_03 = new Asteroid(new Vector(w, h * 3 / 4), new Vector(-2, 2), new Vector(1, -1), 10);
		var normal_ship = new NormalShip(new Vector(w, h / 3), new Vector(1, 1));
		var trapper = new Trapper(new Vector(w, h / 4), new Vector(1, 2));
		var smasher = new Smasher(new Vector(w, h / 4), new Vector(1, 2), new Vector(1, 0));
		var spiker = new Spiker(new Vector(w, h / 4), new Vector(1, 2), new Vector(1, 0));
		if (level == "level01") {
			var first = new Space("one-player", ship_one, [asteroid_01, new Annihilator(new Vector(100, h * Math.random()), new Vector(1, 0))], [asteroid_03]);
		}
		else if (level == "level02") {
			var first = new Space("one-player", ship_one, [normal_ship,
														   new Asteroid(new Vector(-w, h * 3 / 4), new Vector(-2, 2), new Vector(1, -1), 10),
														   new Asteroid(new Vector(w * 1 / 3, h * 2 / 3), new Vector(1, 6), new Vector(2, -7), 10)],
														  [new NormalShip(new Vector(-w, h * Math.random()), new Vector(-2, -3)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-2, -0.5), 10),
														   new NormalShip(new Vector(w, h * Math.random()), new Vector(2, -1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(3, 1)),
														   new NormalShip(new Vector(-w * Math.random(), -h), new Vector(-1, -2)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-3, 0.1), 10),
														   new Sniper(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
		}
		else if (level == "level03") {
			var first = new Space("one-player", ship_one, [new Destroyer(new Vector(-w, h * Math.random()), new Vector(0.5, 3)),
														   new Asteroid(new Vector(-w * Math.random(), h * 1 / 2), new Vector(-2, 2), new Vector(1, -1), 10),
														   new Asteroid(new Vector(w * 1 / 9, h * Math.random()), new Vector(1, 6), new Vector(2, -7), 10)],
														  [new NormalShip(new Vector(-w, h * Math.random()), new Vector(-2, -3)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-2, -0.5), 10),
														   new Destroyer(new Vector(w, h * Math.random()), new Vector(-1, -2)),
														   new Destroyer(new Vector(-w, h * Math.random()), new Vector(4, -0.5)),
														   new Destroyer(new Vector(w, h * Math.random()), new Vector(-3, 1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(3, 1)),
														   new Destroyer(new Vector(-w * Math.random(), -h), new Vector(-1, -2)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-3, 0.1), 10),
														   new Sniper(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
		}
		else if (level == "level04") {
			var first = new Space("one-player", ship_one, [new Spread(new Vector(-w, h * Math.random()), new Vector(-1, -0.5)),
														   new Sniper(new Vector(-w * Math.random(), h * 1 / 2), new Vector(-2, 2)),
														   new Asteroid(new Vector(w * 1 / 9, h * Math.random()), new Vector(1, 6), new Vector(2, -7), 10)],
														  [new Sniper(new Vector(-w, h * Math.random()), new Vector(-2, -3)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-2, -0.5), 10),
														   new Spread(new Vector(w, h * Math.random()), new Vector(-1, -2)),
														   new Destroyer(new Vector(-w, h * Math.random()), new Vector(4, -0.5)),
														   new Spread(new Vector(w, h * Math.random()), new Vector(-3, 1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(3, 1)),
														   new Destroyer(new Vector(-w * Math.random(), -h), new Vector(-1, -2)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-3, 0.1), 10),
														   new Spread(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
		}
		else if (level == "level05") {
			var first = new Space("one-player", ship_one, [new Spread(new Vector(-w, h * Math.random()), new Vector(0.5, 1.5)),
														   new Skimmer(new Vector(-w * Math.random(), h * 1 / 2), new Vector(-0.5, 0.9)),
														   new Asteroid(new Vector(w * 1 / 9, h * Math.random()), new Vector(1, 6), new Vector(1, -3.5), 10)],
														  [new Skimmer(new Vector(-w, h * Math.random()), new Vector(-1, -1.5)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-2, -0.5), 10),
														   new Destroyer(new Vector(w, h * Math.random()), new Vector(-1, -2)),
														   new Spread(new Vector(-w, h * Math.random()), new Vector(4, -0.5)),
														   new Destroyer(new Vector(w, h * Math.random()), new Vector(-3, 1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(1.5, 0.5)),
														   new Skimmer(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-3, 0.1), 10),
														   new Sniper(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
		}
		else if (level == "level06") {
			var first = new Space("one-player", ship_one, [trapper], []);
		}
		else if (level == "level07") {
			var first = new Space("one-player", ship_one, [smasher,
														   new Spiker(new Vector(w, h * Math.random()), new Vector(-0.5, -1), new Vector(1, 0)),
														   new Spread(new Vector(-w, h * Math.random()), new Vector(-1.5, 0.3))],
														  [spiker,
														   new Smasher(new Vector(w, h * Math.random()), new Vector(0.8, 2.4), new Vector(1, 0)),
														   new Spread(new Vector(-w, h * Math.random()), new Vector(0.5, 1.5)),
														   new Spiker(new Vector(w, h * Math.random()), new Vector(-0.5, -1), new Vector(1, 0)),
														   new Smasher(new Vector(-w, h * Math.random()), new Vector(-1, 2), new Vector(1, 0))],
														   new Spiker(new Vector(w, h * Math.random()), new Vector(-0.5, -1), new Vector(1, 0)));
		}
		else if (level == "level08") {
			var first = new Space("one-player", ship_one, [new Tracker(new Vector(-w, h * Math.random()), new Vector(0.5, 1.5)),
														   new Skimmer(new Vector(-w * Math.random(), h * 1 / 2), new Vector(-0.5, 0.9)),
														   new Asteroid(new Vector(w * 1 / 9, h * Math.random()), new Vector(1, 6), new Vector(1, -3.5), 10)],
														  [new Skimmer(new Vector(-w, h * Math.random()), new Vector(-1, -1.5)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-2, -0.5), 10),
														   new Tracker(new Vector(w, h * Math.random()), new Vector(-1, -2)),
														   new Spread(new Vector(-w, h * Math.random()), new Vector(4, -0.5)),
														   new Tracker(new Vector(w, h * Math.random()), new Vector(-3, 1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(1.5, 0.5)),
														   new Skimmer(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-3, 0.1), 10),
														   new Tracker(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
		}
		else if (level == "level09") {
			var first = new Space("one-player", ship_one, [new Tracker(new Vector(-w, h * Math.random()), new Vector(0.5, 1.5))], []);
			first.dark = true;
			first.draw = false;
		}
		else if (level == "level10") {
			var first = new Space("one-player", ship_one, [new Spread(new Vector(-w, h * Math.random()), new Vector(0.5, 1.5)),
														   new Skimmer(new Vector(-w * Math.random(), h * 1 / 2), new Vector(-0.5, 0.9)),
														   new Asteroid(new Vector(w * 1 / 9, h * Math.random()), new Vector(1, 6), new Vector(1, -3.5), 10)],
														  [new Overlord(new Vector(-w, h * Math.random()), new Vector(-1, -1.5)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-2, -0.5), 10),
														   new Tracker(new Vector(w, h * Math.random()), new Vector(-1, -2)),
														   new Spread(new Vector(-w, h * Math.random()), new Vector(4, -0.5)),
														   new Overlord(new Vector(w, h * Math.random()), new Vector(-3, 1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(1.5, 0.5)),
														   new Skimmer(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-3, 0.1), 10),
														   new Overlord(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
		}
		else if (level == "level11") {
			var first = new Space("one-player", ship_one, [new Tracker(new Vector(-w, h * Math.random()), new Vector(0.5, 1.5)),
														   new Sniper(new Vector(-w * Math.random(), h * 1 / 2), new Vector(-0.5, 0.9)),
														   new NormalShip(new Vector(w * Math.random(), h * 1 / 2), new Vector(-1, -2))],
														  [new Sniper(new Vector(-w, h * Math.random()), new Vector(-1, -1.5)),
														   new Skimmer(new Vector(w, h * Math.random()), new Vector(-1, -2)),
														   new Spread(new Vector(-w, h * Math.random()), new Vector(4, -0.5)),
														   new Tracker(new Vector(w, h * Math.random()), new Vector(-3, 1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(1.5, 0.5)),
														   new Skimmer(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Spread(new Vector(w * Math.random(), h), new Vector(1, -1)),
														   new Trapper(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
			first.draw = false;
		}
		else {
			var first = new Space("one-player", ship_one, [new Skimmer(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Asteroid(new Vector(-w, h * 3 / 4), new Vector(-2, 2), new Vector(1, -1), 10),
														   new Asteroid(new Vector(w * 1 / 3, h * 2 / 3), new Vector(1, 6), new Vector(2, -7), 10),
														   new SuperSniper(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1))],
														  [new Sniper(new Vector(-w, h * Math.random()), new Vector(-2, -3)),
														   new Tracker(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-2, -0.5), 10),
														   new NormalShip(new Vector(w, h * Math.random()), new Vector(2, -1)),
														   new Smasher(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Spiker(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Spread(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Sniper(new Vector(w, h * Math.random()), new Vector(3, 1)),
														   new Trapper(new Vector(-w * Math.random(), -h), new Vector(-1, -2)),
														   new Spread(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Asteroid(new Vector(w * Math.random(), h), new Vector(3, 4), new Vector(-3, 0.1), 10),
														   new Overlord(new Vector(-w * Math.random(), -h), new Vector(-0.5, -1)),
														   new Sniper(new Vector(-w * Math.random(), -h), new Vector(1, 1))]);
		}
		first.createFrame();
		$("#resume_img").click(function() {
			$("#pause").fadeToggle("fast");
			setTimeout(function() {first.update()}, 100);
		});
		setTimeout(function() {first.update()}, 1000);
	});
});