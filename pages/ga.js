import { std } from "mathjs";
import { random, sample, shuffle } from "lodash";

class Chromosome {
    constructor(male, female, numClasses) {
        // arrays
        this.male = male;
        this.female = female;
        this.classes = [...Array(numClasses).keys()];

        // number
        this.numClasses = numClasses;
    }

    // Genetic operators

    static swapMutation(c, gender) {
        var gc = gender === 'M' ? c.male : c.female;

        var p1 = Chromosome.getPivot(gc);
        var p2;
        do { Chromosome.getPivot(gc) } while (p1 === p2);

        // swap
        [gc[p1], gc[p2]] = [gc[p2], gc[p1]];

        if (gender === 'M') return Chromosome(gc, c.female, c.numClasses);
        else return Chromosome(c.male, gc, c.numClasses);
    }

    static crossOver(c1, c2) {
        return sample([Chromosome(c1.male, c2.female), Chromosome(c1.female, c2.male)])
    }

    // Fitness evaluation

    fitness(malesArray, femalesArray) {
        var sumArray = new Array(this.numClasses).fill(0);

        malesArray.forEach(function (e, i) {
            sumArray[e] += i[2];
        })

        femalesArray.forEach(function (e, i) {
            sumArray[e] += i[2];
        })

        return std(sumArray);
    }

    // Helpers

    static initializeGC(numStudents, numClasses) {
        var gc = [];
        for (var i = 0; i < numStudents; i++) {
            gc.push(i % numClasses);
        }
        return shuffle(gc);
    }

    static getPivot(gc) {
        return Math.floor(Math.random() * gc.length);
    }
}

class Population {
    constructor(capacity) {
        // [[mc, fc, fitness], ...]
        this.population = [];
        this.capacity = capacity;
    }

    rerank() {
        this.population.sort((a, b) => a[2] - b[2]);
    }

    naturalSelection() {
        this.rerank();
        this.population = this.population.slice(0, this.capacity);
    }

    breed(n) {
        for (var i = 0; i < n; i++) {
            const lottery = Math.random() * 100;
            if (lottery <= 50) {
                // swap
            }
            else {
                // cross-over
            }
        }
        // determine fitness
        // add to population
    }
}