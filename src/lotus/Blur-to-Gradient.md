# Converting Blur to Radial Gradient

## Step 1: Input and Output

- R = radius of circle
- Sigma = how blurry it is

In the original:

- R = r = `20`
- Sigma = stdDeviation = `5`

The original was also scaled 1.30936, so:

- R = `20 * 1.30936 = 26.19`
- Sigma = `5 * 1.30936 = 6.547`

The output we want is the opacity (0 to 1).

## Step 2: Where the blur ends

Gaussian blur bleeds color away from its center following a bell curve. The 3-sigma rule says that in a bell curve, the value of any point over 3 \* sigma distance away is effectively 0. Thus, the blur ends at:

```
newR = R     + Sigma * 3
     = 26.19 + 6.547 * 3
     = 45.83
```

Given this we create the circle using:

```svg
<circle cx="..." cy="..." r="45.83" fill="url(#red-dot)" />
```

Note that the bell curve applying to each pixel up to 3-sigma away means even pixels inside the circle can bleed out beyond the edge. The visible bleed is not merely from the pixels on the edge.

## Step 3: Where the stops are

Given R is the edge, the furthest stops are `R + Sigma * 3` and `R - Sigma * 3`. To ensure accurate colors, we'll add 3 more stops each between both furthest stops and R. Thus the stops are:

```
R4 =  R + Sigma * 3           = 45.83
R3 =  R + Sigma * 3 * (3 / 4) = 40.92
R2 =  R + Sigma * 3 * (2 / 4) = 36.01
R1 =  R + Sigma * 3 * (1 / 4) = 31.10
R0 =  R                       = 26.19
R1' = R - Sigma * 3 * (1 / 4) = 21.28
R2' = R - Sigma * 3 * (2 / 4) = 16.37
R3' = R - Sigma * 3 * (3 / 4) = 11.46
R4' = R - Sigma * 3           =  6.55
```

## Step 4: Finding the opacity of each stop

Given Ri from Step 3, we get the opacity of each stop using the steps:

- a. Measure the distance between point (Ri, 0) and every point inside the circle.
- b. Given each distance in (a), find the opacity per unit area of those points on Ri.
- c. Multiply the values in (b) by their area and add them together.

### Step 4(a): Find the distance

If we want to find distance between 2 points P and Q, we use Pythagoras theorem:

```
DistanceX = |Px - Qx|
DistanceY = |Py - Qy|
Distance  = sqrt(DistanceX * DistanceX + DistanceY * DistanceY)
```

Now we need to find all the (x, y) inside the circle. For this we switch to polar coordinates from cartesian coordinates. We represent x and y as:

```
Rho = distance (0 to R)
Theta = angle  (0 to 2 Pi)

x = Rho * cos(Theta)
y = Rho * sin(Theta)
```

As you can see, we just need to loop through 0 to R and then 0 to 2 Pi to reach every point.

Decide how many steps you want to loop through. If you want 1000 steps:

```
RhoStep   = R / 1000      = 26.19 / 1000     = 0.02619
ThetaStep = 2 * Pi / 1000 = 2 * 3.142 / 1000 = 0.006284
```

These steps are the same for every stop. Only the measuring point (Ri, 0) changes from stop to stop.

### Step 4(b): Find the opacity per unit area

This is the formula for the Gaussian function:

```
constant e = Euler's number = 2.71828
constant Pi = 3.142

Peak               = maximum height of bell curve = 1 / (2 * Pi * Sigma * Sigma)
Falloff            = e ^ (-(Distance * Distance) / (2 * Sigma * Sigma))
OpacityPerUnitArea = Peak * Falloff
```

### Step 4(c): Multiply the opacity per unit area by area and sum

Now that we have the opacity per unit area of each point on Ri, we need to multiply them by area to get opacity for that whole area around the point.

We use the formula for area of a rectangle (`Width * Height`) to approximate the area of a small piece of a ring of the circle. Since the circumference of a circle is given by `(2 * Pi) * Rho`:

```
Width  = ThetaStep * Rho
Height = RhoStep

Area = Width * Height

Contribution = OpacityPerUnitArea * Area
```

Once we get all the contributions for each point in 0 to R and 0 to 2 Pi, we sum them up to get the final Opacity.

## Step 5: Turning the stops into SVG

Each `<stop>` in the `<radialGradient>` needs the following attributes:

- `offset` = Ri / newR
- `stop-opacity` = the Opacity of Ri from Step 4
- `stop-color` = the color of the circle, `#a93e27` for the red dots

This gives us:

```
Stop  Ri      Offset = Ri / 45.83   Opacity
R4'    6.55   0.143                 0.997
R3'   11.46   0.250                 0.980
R2'   16.37   0.357                 0.910
R1'   21.28   0.464                 0.729
R0    26.19   0.571                 0.450
R1    31.10   0.679                 0.193
R2    36.01   0.786                 0.054
R3    40.92   0.893                 0.009
R4    45.83   1                     0.001
```

R4' and R4 should be very close to 1.0 and 0.0 respectively. Otherwise something went wrong. We round off R4' to 1.0 and R4 to 0 so that the center is fully solid and the gradient ends fully clear.

Final result:

```svg
<radialGradient id="red-dot">
  <stop offset="0.143" stop-color="#a93e27" />
  <stop offset="0.25"  stop-color="#a93e27" stop-opacity="0.98" />
  <stop offset="0.357" stop-color="#a93e27" stop-opacity="0.91" />
  <stop offset="0.464" stop-color="#a93e27" stop-opacity="0.729" />
  <stop offset="0.571" stop-color="#a93e27" stop-opacity="0.45" />
  <stop offset="0.679" stop-color="#a93e27" stop-opacity="0.193" />
  <stop offset="0.786" stop-color="#a93e27" stop-opacity="0.054" />
  <stop offset="0.893" stop-color="#a93e27" stop-opacity="0.009" />
  <stop offset="1"     stop-color="#a93e27" stop-opacity="0" />
</radialGradient>

<circle cx="..." cy="..." r="45.83" fill="url(#red-dot)" />
```
