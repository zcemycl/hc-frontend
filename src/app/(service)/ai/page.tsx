"use client";
import { ProtectedRoute } from "@/contexts";
import { JupyterIcon, ChatbotIcon, AnnotateIcon } from "@/icons";
import {
  CreatePresignedDomainUrlCommand,
  CreateUserProfileCommand,
  DescribeUserProfileCommand,
  DescribeUserProfileResponse,
  ListUserProfilesCommand,
  ListUserProfilesRequest,
  SageMakerClient,
  SageMakerClientConfig,
  UserProfileDetails,
  UserSettings,
} from "@aws-sdk/client-sagemaker";

const rolearn =
  "arn:aws:iam::975050053093:role/terraform-20240619075858415000000001";

async function handleJupyterBtnCallback() {
  let config = {
    region: "eu-west-2",
  } as SageMakerClientConfig;
  if (process.env.NEXT_PUBLIC_ENV_NAME === "local-dev") {
    config = {
      ...config,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env
          .NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
      },
    };
  }
  const client = new SageMakerClient(config);
  const input = {
    // CreatePresignedDomainUrlRequest
    DomainId: "d-oa2xxqb4psru", // required
    UserProfileName: "leo-leung-test", // required
    ExpiresInSeconds: 30,
  };
  const command = new CreatePresignedDomainUrlCommand(input);
  const response = await client.send(command);
  console.log(response.AuthorizedUrl);
}

export default function AI() {
  return (
    <ProtectedRoute>
      <section className="text-gray-400 bg-gray-900 body-font h-[83vh] sm:h-[90vh]">
        <div
          className="container px-2 py-24 mx-auto grid justify-items-center
    "
        >
          <div className="sm:w-1/2 flex flex-col mt-8 w-screen p-10 space-y-2">
            <h2 className="text-white text-lg mb-1 font-medium title-font">
              AI Tools
            </h2>
            <button
              className="text-white bg-red-500 border-0 py-2
                flex justify-start content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-red-600 
                rounded text-2xl w-full"
            >
              <AnnotateIcon />
              Annotation
            </button>
            <button
              className="text-white bg-green-500 border-0 py-2
                flex justify-start content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-green-600 
                rounded text-2xl w-full"
              onClick={() => {
                console.log("Open JupyterLab");
                handleJupyterBtnCallback();
              }}
            >
              <JupyterIcon />
              Jupyter Lab
            </button>
            <button
              className="text-white bg-blue-500 border-0 py-2
                flex justify-start content-center text-center
                align-middle items-center 
                px-6 focus:outline-none hover:bg-blue-600 
                rounded text-2xl w-full"
            >
              <ChatbotIcon />
              Chatbot
            </button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
