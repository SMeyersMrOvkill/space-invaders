
class Random
{
    static range(min, max) {
        return Math.trunc(Math.random() * (max - min) + min);
    }
}

export default Random;