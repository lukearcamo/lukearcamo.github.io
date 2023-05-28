---
layout: article
title: "How to survive CHE112"
category: engineering
tags: study-notes
# permalink: none
background-color: "#EE9B00"
needs-mathjax: true
---
Known as one of the hardest and lowest-average courses in first-year, Physical Chemistry frightened a lot of people. While in my opinion the way they lectured this course was really disorganized to the detriment of those few who actually attended lectures, I was fortunate in that I prefer self-learning by reading the textbook. Here are some tips and tricks I have gathered which are often left unsaid yet are essential to solving given problems.

<!--split-->

- [Module 0: Course structure](#module-0-course-structure)
- [Module 1: Units](#module-1-units)
  - [SI units](#si-units)
  - [Significant figures](#significant-figures)
  - [Dimensional analysis](#dimensional-analysis)
  - [Key constants you should memorize:](#key-constants-you-should-memorize)
- [Module 2: Ideal gases](#module-2-ideal-gases)
  - [Ideal gas law](#ideal-gas-law)
  - [Partial pressure, Dalton's law](#partial-pressure-daltons-law)
  - [Kinetic theory of gases](#kinetic-theory-of-gases)
  - [Real gases, the van der Waals equation](#real-gases-the-van-der-waals-equation)
- [Module 3: First Law of Thermodynamics](#module-3-first-law-of-thermodynamics)

<!--split-->

## Module 0: Course structure
testing

## Module 1: Units

### SI units

### Significant figures
They teach some complicated rules, but in reality, they are inconsistent with this. The profs, TAs, etc. all disagree, so just keep the highest precision in you calculations, then round the final answer to however many sig figs they give for the values in the question (usually three sig figs).

### Dimensional analysis

### Key constants you should memorize:
  * 1 atm = 101325 Pa
  * 1 bar = 10<sup>5</sup> Pa = 100 kPa
  * dont even bother with the non-SI units, who even uses them, also their conversion factors will be on the exam formula sheet

> ### STP: 1 atm or 1 bar?
> According to [Wikipedia](https://en.wikipedia.org/wiki/Standard_temperature_and_pressure) (yes i love wikipedia, it's reliable enough idc what anyone's teacher says), STP was defined as 1 atm until 1982, when the IUPAC changed it to 1 bar. So it's 1 bar right?
> WRONG. They are so inconsistent with this. The midterm review sheet said 1 atm, the entire chemical equilibrium unit said 1 atm = 1 bar (?), profs and TAs give different answers based on the alignment of Mars and Jupiter ANYWAYS this assumption seemed most reasonable to me: If the question does not specify anything and you have to assume "ordinary room conditions", use 1 atm. Otherwise, use 1 bar, especially for the chemical equilibrium unit.

> ### STP vs standard conditions
> STP is 0 &deg;C, whereas standard conditions given for most data values, gases, etc. is 25 &deg;C. However, once again, they are inconsistent with this. Follow official standards, request regrade after.

## Module 2: Ideal gases

### Ideal gas law
$$PV = nRT$$, where P = pressure, V = volume, n = moles, R = gas constant, T = temperature *in Kelvin*

Tip: Always memorize R = 8.3145, no need for its units, because it you make sure your P and V units are consistent, you will get the right answer. Either:
  * P is Pa, V is m<sup>3</sup>
  * P is kPa, V is L or dm<sup>3</sup>
  <!-- * No need to memorize all of the other gas laws, they can all be derived from this -->
  <!-- * Can be used in calculations involving density, mass, molar mass, etc. -->

### Partial pressure, Dalton's law
$$P_{total} = P_a + P_b + ...$$ — The total pressure of a gas is the sum of its component gases

$$P_i = P_{total} \times x_i$$ — The pressure of a component gas is proportional to its mole fraction within the total gas

### Kinetic theory of gases
They rarely ask non-calculation questions, so just familiarize yourself with the main idea:
  * Ideal gas particles have zero volume
  * Can ignore attractive/repulsive forces
  * Collisions are perfectly elastic (no energy lost)
  * Energy within gas is proportional to temperature

<!-- the equation needs to be a separate paragraph (line breaks before and after) in order to be the big form -->
### Real gases, the van der Waals equation

$$ P = \frac {nRT} {V-nb} - \frac {an^2} {V^2} $$

Similar to ideal gas law, but with extra terms to help account for attractive/repulsive forces in pressure and the nonzero volume of the particles. a and b are parameters that depend on the gas. They will usually be given in the question/formula sheet. 
<!-- * I think they also go over Archimedes' principle and Pascal's law but we never used them often. They prefer to torment us with actual complicated questions regarding gases and thermo. -->
<!-- * Compressibility factor -->

> ### Breaking down Prof. Kirk's abominable connected vessel questions
> The key is understanding that there are two main stages to the process: Before connection, and after connection.
>
> #### Step 1:
> To help visualize this, personally I did not find drawing a diagram helpful because there are two dimensions to each variable, time (before/after stages) and the vessel (first/second vessel). Instead, list out all the variables *for each stage*: which values stay constant across both stages, and which values are the same for both vessels.
> 
> #### Step 2: Before connection
> Calculate the total number of moles in both vessels. This step may vary depending on the composition of the gases, which component the question is asking about, etc.
> #### Step 3: After connection
> There are two important equations that can be used:
>
> #### Eqn. 1:
> 
> $$n_{total, before} = n_{1, after} + n_{2, after}$$
> 
> * Basically conservation of mass: number of moles before = number of moles after, and moles in both vessels = moles in vessel 1 + vessel 2
> * Use this equation if the question is asking for pressure. After replacing both n's with the rearranged ideal gas law ($$n = \frac {PV} {RT}$$), the final big equation would look like this:
> 
> $$n_{total, before} = \frac {P_{1, after}V_1} {RT_{1, after}} + \frac {P_{2, after}V_2} {RT_{2, after}}$$
>
> #### Eqn. 2:
> 
> $$P_{1, after} = P_{2, after}$$
> 
> * After connection, the pressure in both vessels is shared evenly.
> * Use this equation if the question is asking for moles, since you can substitute the first equation to find one vessel's moles. After replacing both P's with the rearranged ideal gas law ($$P = \frac {nRT} {V}$$), The big final equation would look like:
> 
> $$\frac {n_1RT1} {V_1} = \frac {(n_{total, before} - n1)RT} {V_2}$$
>
> #### Step 4: Plug in values & isolate the one you are looking for
> 
> #### Step 5: Cry
> But seriously, don't feel bad for too long if you are struggling with these questions. In our year, the average for a midterm question like this was 0.5/9 marks. Also the average for that midterm was ✨47%✨ 💀. They curve the marks at the end of the semester though.

## Module 3: First Law of Thermodynamics
