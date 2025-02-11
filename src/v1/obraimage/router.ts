import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkLogin } from '../utils/check.login';
import { ObraImageInputSchemaJson, ObraImageUpdateInputSchemaJson } from './schemas';
import { ObraImageInput, ObraImageUpdateInput } from './interface';
import ObraImageController from './controller';

const modelController = new ObraImageController();

async function ObraImageRouter(fastify: FastifyInstance) {
    fastify.get('/all',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const models = await modelController.getAllObraImages();
                return reply.status(200).send(models);
            } catch (error) {
                console.error('Error fetching models:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.get('/random',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const models = await modelController.getRandomObraImages();
                return reply.status(200).send(models);
            } catch (error) {
                console.error('Error fetching models:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.get('/:id',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: string };
                const model = await modelController.getObraImageById(parseInt(id, 10));
                return reply.status(200).send(model);
            } catch (error) {
                console.error('Error fetching model:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.post('/:obraId',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { obraId } = request.params as { obraId: string };
                const data = await request.file();
                if (!data) {
                    return reply.status(400).send({ message: 'No file uploaded' });
                }


                // Verifica se o campo obraId existe
                if (!obraId) {
                    return reply.status(400).send({ message: 'obraId is required' });
                }

                const body = {
                    obraId: parseInt(obraId),
                    image: {
                        buffer: await data.toBuffer(),
                        mimetype: data.mimetype,
                        originalname: data.filename
                    }
                };

                const result = await modelController.createObraImage(body);
                return reply.status(201).send(result);
            } catch (error) {
                console.error('Error creating obra image:', error);
                return reply.status(500).send({ error: error.message });
            }
        });

    fastify.put('/:id',
        {
            schema: {
                body: ObraImageUpdateInputSchemaJson,
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: string };
                const data = request.body as ObraImageUpdateInput;
                const model = await modelController.updateObraImage(parseInt(id, 10), data);
                return reply.status(200).send(model);
            } catch (error) {
                console.error('Error updating model:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );

    fastify.delete('/:id',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    },
                    required: ['id'],
                },
            },
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: string };
                const model = await modelController.deleteObraImage(parseInt(id, 10));
                return reply.status(200).send(model);
            } catch (error) {
                console.error('Error deleting model:', error);
                return reply.status(500).send({ message: 'Internal server error' });
            }
        }
    );
}

export default ObraImageRouter;