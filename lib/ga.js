import { min, std } from "mathjs";
import { sample, shuffle } from "lodash";

function randInt(num) { return Math.floor(Math.random(num) * num); }

export class Chromosome {
    constructor(male, female, numClasses) {
        // arrays
        this.male = male;
        this.female = female;

        // number
        this.numClasses = numClasses;
        this.fitness = 99999;
        this.sumArray = [];
    }

    // Genetic operators

    static swapMutation(c, gender) {
        var gc = gender === 'M' ? c.male : c.female;

        var p1 = Chromosome.getPivot(gc);
        var p2;
        do { p2 = Chromosome.getPivot(gc); } while (p1 === p2);

        // swap
        [gc[p1], gc[p2]] = [gc[p2], gc[p1]];

        if (gender === 'M') return new Chromosome(gc, c.female, c.numClasses);
        else return new Chromosome(c.male, gc, c.numClasses);
    }

    static crossOver(c1, c2) {
        if (c1.male.length === c2.male.length && c1.female.length === c2.female.length) {
            return sample([new Chromosome(c1.male, c2.female, c1.numClasses), new Chromosome(c1.female, c2.male, c1.numClasses)]);
        }
        else { return false; }
    }

    // Fitness evaluation
    // needs fix
    calcFitness(malesArray, femalesArray) {
        var sumArray = new Array(this.numClasses).fill(0);
        this.male.forEach(function (e, i) {
            if (malesArray[i] && malesArray[i][2]) sumArray[e] += malesArray[i][2];
        })

        this.female.forEach(function (e, i) {
            if (femalesArray[i] && femalesArray[i][2]) sumArray[e] += femalesArray[i][2];
        })

        this.sumArray = sumArray;
        this.fitness = std(sumArray);
    }

    // Helpers

    static initializeGC(gender, numStudents, numClasses) {
        var gc = [];
        for (var i = 0; i < numStudents; i++) {
            if (gender === 'M') gc.push(i % numClasses);
            else gc.push((numClasses - 1) - (i % numClasses));
        }
        return shuffle(gc);
    }

    static getPivot(gc) {
        return randInt(gc.length);
    }
}

export class Population {
    constructor(malesArray, femalesArray, capacity, numClasses) {
        // [chromosome, ...]
        this.population = [];
        this.malesArray = malesArray;
        this.femalesArray = femalesArray;

        this.capacity = capacity;
        this.numClasses = numClasses;
    }

    rerank() {
        this.population.sort((a, b) => a.fitness - b.fitness);
    }

    naturalSelection() {
        this.rerank();
        this.population = this.population.slice(0, this.capacity);
    }

    initialize() {
        const malesBaseArray = Chromosome.initializeGC('M', this.malesArray.length, this.numClasses);
        const femalesBaseArray = Chromosome.initializeGC('F', this.femalesArray.length, this.numClasses);

        var indv;
        for (var i = 0; i < this.capacity; i++) {
            indv = new Chromosome(shuffle(malesBaseArray), shuffle(femalesBaseArray), this.numClasses);
            indv.calcFitness(this.malesArray, this.femalesArray);
            this.population.push(indv);
        }
    }

    breed(n) {
        for (var i = 0; i < n; i++) {
            const lottery = Math.random() * 100;
            const validIndex = min(this.capacity, this.population.length);
            var offspring;

            if (lottery <= 60) {
                // swap
                offspring = Chromosome.swapMutation(this.population[randInt(validIndex)], sample(['M', 'F']));
            }
            else {
                // cross-over
                var p1 = randInt(validIndex);
                var p2;
                do { p2 = randInt(validIndex); } while (p1 === p2);

                offspring = Chromosome.crossOver(this.population[p1], this.population[p2]);

                // if # males are not equal, then operate on mutation instead
                if (!offspring) {
                    offspring = Chromosome.swapMutation(this.population[randInt(validIndex)], sample(['M', 'F']));
                }
            }
            // determine fitness and add to population
            offspring.calcFitness(this.malesArray, this.femalesArray);
            this.population.push(offspring);
        }
    }

    step(numOffspring = 20) {
        this.breed(numOffspring);
        this.naturalSelection();
    }
}