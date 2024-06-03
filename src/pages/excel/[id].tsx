import { testDetails } from "@/test-data/patientDetails"

function PatientSummary() {
	const details = testDetails

	return (
		<div className="flex flex-col w-1/2 justify-center items-center">
			<article className="mt-8 text-3xl font-bold">
				{testDetails.name}
			</article>
			<div className="flex flex-col mt-4 gap-y-4">
				<div className="flex flex-col">
					<article className="text-xl font-semibold">
						Patient Details
					</article>
					<article>Gender: {testDetails.gender}</article>
					<article>Date of Birth: {testDetails.birthDate}</article>
					<article>Height: {testDetails.height}cm</article>
					<article>Weight: {testDetails.weight}kg</article>
				</div>
				<div className="flex flex-col">
					<article className="text-xl font-semibold">
						Contact Information
					</article>
					<article>Phone: {testDetails.phone}</article>
					<article>Address: {testDetails.streetAddress}</article>
					<article>Suburb: {testDetails.suburb}</article>
					<article>Postcode: {testDetails.postcode}</article>
					<article>
						Admission Site: {testDetails.admissionSite}
					</article>
				</div>
				<div className="flex flex-col">
					<article className="text-xl font-semibold">
						Doctor Information
					</article>
					<article>Name: {testDetails.doctorName}</article>
					<article>Code: {testDetails.doctorCode}</article>
					<article>Phone: {testDetails.doctorPhone}</article>
				</div>
			</div>
		</div>
	)
}

export default PatientSummary
