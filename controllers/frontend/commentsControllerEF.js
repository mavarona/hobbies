const Comments = require('../../models/Comments');
const Meeti = require('../../models/Meeti');

exports.addComment = async(req, res, next) => {

    const { comment } = req.body;

    await Comments.create({
        message: comment,
        userId: req.user.id,
        meetiId: req.params.id
    });

    res.redirect('back');
    next();

}

exports.deleteComment = async(req, res, next) => {

    const { commentId } = req.body;


    const comment = await Comments.findOne({
        where: {
            id: commentId
        }
    });

    if (!comment) {
        res.status(404).send('Operación no válida');
        return next();
    }

    const meeti = await Meeti.findOne({
        where: {
            id: comment.meetiId
        }
    });

    if (comment.userId === req.user.id || meeti.userId == req.user.id) {
        await Comments.destroy({
            where: {
                id: comment.id
            }
        });
        res.status(200).send('Eliminado Correctamente');
        return next();
    } else {
        res.status(403).send('Operación no válida');
        return next();
    }


    res.send('Se eliminó el comentario');
}