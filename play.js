let foods = new WeakMap();
foods.set(['italian'], 'gelato');
foods.set(['mexican'], 'torta');
foods.set(['canadian'], 'poutine');

let comunidades = ['Cataluña', 'Valencia', 'Murcia'];
foods.set(comunidades, 'hot chicken');

console.log(
    foods.get(['italian']),
    foods.get(comunidades),
    //foods.size
);